import { db } from "@/db/connection";
import {
  stories,
  duplicateRemoverResults,
  dataExtractorResults,
  storyTellerResults,
} from "@/db/schema";
import { eq, and, lt, count } from "drizzle-orm";
import type { DeleteStoryParams, OperationResponse } from "@/types/story";
import { z } from "zod";

// Validation schema for delete_story parameters
const deleteStorySchema = z.object({
  story_id: z
    .string()
    .min(1, "Story ID is required")
    .max(255, "Story ID too long"),
  hard_delete: z.boolean().default(false),
});

/**
 * MCP Tool: delete_story
 * Soft delete or hard delete a story and all associated data
 */
export async function deleteStory(
  params: DeleteStoryParams
): Promise<OperationResponse> {
  try {
    // Validate input parameters
    const validation = deleteStorySchema.safeParse(params);
    if (!validation.success) {
      return {
        success: false,
        message: "Invalid input parameters",
        error: validation.error.errors
          .map((e: any) => `${e.path.join(".")}: ${e.message}`)
          .join(", "),
      };
    }

    const { story_id, hard_delete } = validation.data;

    // Check if story exists
    const existingStory = await db
      .select({
        story_id: stories.story_id,
        status: stories.status,
      })
      .from(stories)
      .where(eq(stories.story_id, story_id))
      .limit(1);

    if (existingStory.length === 0) {
      return {
        success: false,
        message: "Story not found",
        error: `Story with ID '${story_id}' does not exist`,
      };
    }

    const story = existingStory[0];

    // Check if already soft deleted
    if (!hard_delete && story.status === "deleted") {
      return {
        success: true,
        message: "Story already deleted",
        story_id: story_id,
      };
    }

    if (hard_delete) {
      // Hard delete: Remove all records from database
      await db.transaction(async (tx) => {
        // Delete in reverse order of foreign key dependencies

        // 1. Delete story teller results
        await tx
          .delete(storyTellerResults)
          .where(eq(storyTellerResults.story_id, story_id));

        // 2. Delete data extractor results
        await tx
          .delete(dataExtractorResults)
          .where(eq(dataExtractorResults.story_id, story_id));

        // 3. Delete duplicate remover results
        await tx
          .delete(duplicateRemoverResults)
          .where(eq(duplicateRemoverResults.story_id, story_id));

        // 4. Delete main story record
        await tx.delete(stories).where(eq(stories.story_id, story_id));
      });

      return {
        success: true,
        message: "Story permanently deleted from database",
        story_id: story_id,
      };
    } else {
      // Soft delete: Update status to 'deleted'
      await db
        .update(stories)
        .set({
          status: "deleted" as any, // Note: Need to add 'deleted' to status enum in schema
          updated_at: new Date(),
        })
        .where(eq(stories.story_id, story_id));

      return {
        success: true,
        message: "Story marked as deleted (soft delete)",
        story_id: story_id,
      };
    }
  } catch (error) {
    console.error("Error deleting story from database:", error);
    return {
      success: false,
      message: "Failed to delete story",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Utility function to restore a soft-deleted story
 */
export async function restoreStory(
  story_id: string,
  new_status: "processing" | "completed" | "failed" = "completed"
): Promise<OperationResponse> {
  try {
    // Check if story exists and is soft deleted
    const existingStory = await db
      .select({
        story_id: stories.story_id,
        status: stories.status,
      })
      .from(stories)
      .where(eq(stories.story_id, story_id))
      .limit(1);

    if (existingStory.length === 0) {
      return {
        success: false,
        message: "Story not found",
        error: `Story with ID '${story_id}' does not exist`,
      };
    }

    const story = existingStory[0];

    if (story.status !== "deleted") {
      return {
        success: false,
        message: "Story is not deleted",
        error: `Story with ID '${story_id}' is not in deleted state (current status: ${story.status})`,
      };
    }

    // Restore story by updating status
    await db
      .update(stories)
      .set({
        status: new_status,
        updated_at: new Date(),
      })
      .where(eq(stories.story_id, story_id));

    return {
      success: true,
      message: `Story restored with status '${new_status}'`,
      story_id: story_id,
    };
  } catch (error) {
    console.error("Error restoring story:", error);
    return {
      success: false,
      message: "Failed to restore story",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Utility function to get all deleted stories for a user
 */
export async function getDeletedStories(
  user_id?: string,
  limit: number = 10,
  offset: number = 0
): Promise<{
  success: boolean;
  data?: any[];
  total?: number;
  error?: string;
}> {
  try {
    const conditions = [];
    conditions.push(eq(stories.status, "deleted" as any));

    if (user_id) {
      conditions.push(eq(stories.user_id, user_id));
    }

    // Get deleted stories
    const deletedStories = await db
      .select({
        story_id: stories.story_id,
        user_id: stories.user_id,
        status: stories.status,
        created_at: stories.created_at,
        updated_at: stories.updated_at,
      })
      .from(stories)
      .where(conditions.length > 1 ? and(...conditions) : conditions[0])
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(stories)
      .where(conditions.length > 1 ? and(...conditions) : conditions[0]);

    return {
      success: true,
      data: deletedStories,
      total: totalResult[0]?.count || 0,
    };
  } catch (error) {
    console.error("Error getting deleted stories:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Utility function to permanently delete all soft-deleted stories older than specified days
 */
export async function purgeOldDeletedStories(
  olderThanDays: number = 30
): Promise<OperationResponse> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    // Find stories that are soft deleted and older than cutoff
    const storiesToPurge = await db
      .select({ story_id: stories.story_id })
      .from(stories)
      .where(
        and(
          eq(stories.status, "deleted" as any),
          lt(stories.updated_at, cutoffDate)
        )
      );

    if (storiesToPurge.length === 0) {
      return {
        success: true,
        message: "No old deleted stories found to purge",
      };
    }

    // Permanently delete each story
    let purgedCount = 0;
    for (const story of storiesToPurge) {
      const result = await deleteStory({
        story_id: story.story_id,
        hard_delete: true,
      });

      if (result.success) {
        purgedCount++;
      }
    }

    return {
      success: true,
      message: `Successfully purged ${purgedCount} old deleted stories`,
    };
  } catch (error) {
    console.error("Error purging old deleted stories:", error);
    return {
      success: false,
      message: "Failed to purge old deleted stories",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
