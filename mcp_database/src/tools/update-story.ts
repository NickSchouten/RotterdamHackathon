import { db } from "@/db/connection";
import {
  stories,
  duplicateRemoverResults,
  dataExtractorResults,
  storyTellerResults,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import type {
  UpdateStoryParams,
  OperationResponse,
  Story,
} from "@/types/story";
import { z } from "zod";

// Validation schema for update_story parameters
const updateStorySchema = z.object({
  story_id: z
    .string()
    .min(1, "Story ID is required")
    .max(255, "Story ID too long"),
  updates: z.object({
    user_id: z.string().optional(),
    status: z.enum(["processing", "completed", "failed"]).optional(),
    duplicate_remover_agent: z
      .object({
        original_count: z.number().min(0).optional(),
        unique_count: z.number().min(0).optional(),
        unique_images: z.array(z.string()).optional(),
      })
      .optional(),
    data_extractor_agent: z
      .object({
        images: z
          .array(
            z.object({
              path: z.string(),
              timestamp: z.string(),
              location: z.object({
                lat: z.number().min(-90).max(90),
                lng: z.number().min(-180).max(180),
              }),
              subjects: z.array(z.string()),
            })
          )
          .optional(),
        google_data: z
          .object({
            place: z.string(),
            facts: z.array(z.string()),
            maps_pin: z.object({
              lat: z.number().min(-90).max(90),
              lng: z.number().min(-180).max(180),
            }),
          })
          .optional(),
        preliminary_story: z.string().optional(),
      })
      .optional(),
    story_teller_agent: z
      .object({
        questions: z
          .array(
            z.object({
              question: z.string(),
              answer: z.string(),
            })
          )
          .optional(),
        title: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        word_count: z.number().min(0).optional(),
        tone: z.string().optional(),
        images: z
          .array(
            z.object({
              path: z.string(),
              caption: z.string(),
            })
          )
          .optional(),
      })
      .optional(),
  }),
});

/**
 * MCP Tool: update_story
 * Updates specific fields of an existing story atomically
 */
export async function updateStory(
  params: UpdateStoryParams
): Promise<OperationResponse> {
  try {
    // Validate input parameters
    const validation = updateStorySchema.safeParse(params);
    if (!validation.success) {
      return {
        success: false,
        message: "Invalid input parameters",
        error: validation.error.errors
          .map((e: any) => `${e.path.join(".")}: ${e.message}`)
          .join(", "),
      };
    }

    const { story_id, updates } = validation.data;

    // Check if story exists
    const existingStory = await db
      .select({ story_id: stories.story_id })
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

    // Start database transaction for atomic updates
    await db.transaction(async (tx) => {
      // 1. Update main story table if needed
      const storyUpdates: any = {};
      if (updates.user_id !== undefined) storyUpdates.user_id = updates.user_id;
      if (updates.status !== undefined) storyUpdates.status = updates.status;

      if (Object.keys(storyUpdates).length > 0) {
        storyUpdates.updated_at = new Date();
        await tx
          .update(stories)
          .set(storyUpdates)
          .where(eq(stories.story_id, story_id));
      }

      // 2. Update duplicate remover results if provided
      if (updates.duplicate_remover_agent) {
        const duplicateUpdates: any = {};
        const agent = updates.duplicate_remover_agent;

        if (agent.original_count !== undefined)
          duplicateUpdates.original_count = agent.original_count;
        if (agent.unique_count !== undefined)
          duplicateUpdates.unique_count = agent.unique_count;
        if (agent.unique_images !== undefined)
          duplicateUpdates.unique_images = agent.unique_images;

        if (Object.keys(duplicateUpdates).length > 0) {
          await tx
            .update(duplicateRemoverResults)
            .set(duplicateUpdates)
            .where(eq(duplicateRemoverResults.story_id, story_id));
        }
      }

      // 3. Update data extractor results if provided
      if (updates.data_extractor_agent) {
        const extractorUpdates: any = {};
        const agent = updates.data_extractor_agent;

        if (agent.images !== undefined)
          extractorUpdates.images_data = agent.images;
        if (agent.google_data !== undefined)
          extractorUpdates.google_data = agent.google_data;
        if (agent.preliminary_story !== undefined)
          extractorUpdates.preliminary_story = agent.preliminary_story;

        if (Object.keys(extractorUpdates).length > 0) {
          await tx
            .update(dataExtractorResults)
            .set(extractorUpdates)
            .where(eq(dataExtractorResults.story_id, story_id));
        }
      }

      // 4. Update story teller results if provided
      if (updates.story_teller_agent) {
        const tellerUpdates: any = {};
        const agent = updates.story_teller_agent;

        if (agent.questions !== undefined)
          tellerUpdates.questions = agent.questions;
        if (agent.title !== undefined) tellerUpdates.title = agent.title;
        if (agent.content !== undefined) tellerUpdates.content = agent.content;
        if (agent.word_count !== undefined)
          tellerUpdates.word_count = agent.word_count;
        if (agent.tone !== undefined) tellerUpdates.tone = agent.tone;
        if (agent.images !== undefined) tellerUpdates.images = agent.images;

        if (Object.keys(tellerUpdates).length > 0) {
          await tx
            .update(storyTellerResults)
            .set(tellerUpdates)
            .where(eq(storyTellerResults.story_id, story_id));
        }
      }

      // Always update the main story's updated_at timestamp
      await tx
        .update(stories)
        .set({ updated_at: new Date() })
        .where(eq(stories.story_id, story_id));
    });

    return {
      success: true,
      message: "Story successfully updated",
      story_id: story_id,
    };
  } catch (error) {
    console.error("Error updating story in database:", error);
    return {
      success: false,
      message: "Failed to update story",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Utility function to update only story status
 */
export async function updateStoryStatus(
  story_id: string,
  status: "processing" | "completed" | "failed"
): Promise<OperationResponse> {
  try {
    // Check if story exists
    const existingStory = await db
      .select({ story_id: stories.story_id })
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

    // Update status
    await db
      .update(stories)
      .set({
        status: status,
        updated_at: new Date(),
      })
      .where(eq(stories.story_id, story_id));

    return {
      success: true,
      message: `Story status updated to '${status}'`,
      story_id: story_id,
    };
  } catch (error) {
    console.error("Error updating story status:", error);
    return {
      success: false,
      message: "Failed to update story status",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Utility function to update story metadata only
 */
export async function updateStoryMetadata(
  story_id: string,
  metadata: { user_id?: string; status?: "processing" | "completed" | "failed" }
): Promise<OperationResponse> {
  try {
    // Check if story exists
    const existingStory = await db
      .select({ story_id: stories.story_id })
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

    // Prepare updates
    const updates: any = { updated_at: new Date() };
    if (metadata.user_id !== undefined) updates.user_id = metadata.user_id;
    if (metadata.status !== undefined) updates.status = metadata.status;

    // Update story
    await db.update(stories).set(updates).where(eq(stories.story_id, story_id));

    return {
      success: true,
      message: "Story metadata updated successfully",
      story_id: story_id,
    };
  } catch (error) {
    console.error("Error updating story metadata:", error);
    return {
      success: false,
      message: "Failed to update story metadata",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
