import { db } from "@/db/connection";
import {
  stories,
  duplicateRemoverResults,
  dataExtractorResults,
  storyTellerResults,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import type { ReadStoryParams, StoryResponse, Story } from "@/types/story";
import { z } from "zod";

// Validation schema for read_story parameters
const readStorySchema = z.object({
  story_id: z
    .string()
    .min(1, "Story ID is required")
    .max(255, "Story ID too long"),
});

/**
 * MCP Tool: read_story
 * Retrieves a complete story by story_id using JOIN operations
 */
export async function readStory(
  params: ReadStoryParams
): Promise<StoryResponse> {
  try {
    // Validate input parameters
    const validation = readStorySchema.safeParse(params);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors
          .map((e: any) => `${e.path.join(".")}: ${e.message}`)
          .join(", "),
      };
    }

    const { story_id } = validation.data;

    // Query all related tables with JOIN operations
    const result = await db
      .select({
        // Main story fields
        story_id: stories.story_id,
        user_id: stories.user_id,
        status: stories.status,
        created_at: stories.created_at,
        updated_at: stories.updated_at,

        // Duplicate remover fields
        duplicate_original_count: duplicateRemoverResults.original_count,
        duplicate_unique_count: duplicateRemoverResults.unique_count,
        duplicate_unique_images: duplicateRemoverResults.unique_images,

        // Data extractor fields
        extractor_images_data: dataExtractorResults.images_data,
        extractor_google_data: dataExtractorResults.google_data,
        extractor_preliminary_story: dataExtractorResults.preliminary_story,

        // Story teller fields
        teller_questions: storyTellerResults.questions,
        teller_title: storyTellerResults.title,
        teller_content: storyTellerResults.content,
        teller_word_count: storyTellerResults.word_count,
        teller_tone: storyTellerResults.tone,
        teller_images: storyTellerResults.images,
      })
      .from(stories)
      .leftJoin(
        duplicateRemoverResults,
        eq(stories.story_id, duplicateRemoverResults.story_id)
      )
      .leftJoin(
        dataExtractorResults,
        eq(stories.story_id, dataExtractorResults.story_id)
      )
      .leftJoin(
        storyTellerResults,
        eq(stories.story_id, storyTellerResults.story_id)
      )
      .where(eq(stories.story_id, story_id))
      .limit(1);

    // Check if story was found
    if (result.length === 0) {
      return {
        success: false,
        error: `Story with ID '${story_id}' not found`,
      };
    }

    const row = result[0];

    // Check if all agent results are present
    if (!row.duplicate_original_count && row.duplicate_original_count !== 0) {
      return {
        success: false,
        error: `Story '${story_id}' found but duplicate remover results are missing`,
      };
    }

    if (!row.extractor_images_data) {
      return {
        success: false,
        error: `Story '${story_id}' found but data extractor results are missing`,
      };
    }

    if (!row.teller_questions) {
      return {
        success: false,
        error: `Story '${story_id}' found but story teller results are missing`,
      };
    }

    // Reconstruct the complete story object
    const story: Story = {
      story_id: row.story_id,
      user_id: row.user_id,
      status: row.status as "processing" | "completed" | "failed",
      created_at: row.created_at.toISOString(),
      duplicate_remover_agent: {
        original_count: row.duplicate_original_count!,
        unique_count: row.duplicate_unique_count!,
        unique_images: row.duplicate_unique_images as string[],
      },
      data_extractor_agent: {
        images: row.extractor_images_data as any[],
        google_data: row.extractor_google_data as any,
        preliminary_story: row.extractor_preliminary_story!,
      },
      story_teller_agent: {
        questions: row.teller_questions as any[],
        title: row.teller_title!,
        content: row.teller_content!,
        word_count: row.teller_word_count!,
        tone: row.teller_tone!,
        images: row.teller_images as any[],
      },
    };

    return {
      success: true,
      data: story,
    };
  } catch (error) {
    console.error("Error reading story from database:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Utility function to get story metadata only (without agent results)
 */
export async function getStoryMetadata(
  story_id: string
): Promise<StoryResponse> {
  try {
    const result = await db
      .select({
        story_id: stories.story_id,
        user_id: stories.user_id,
        status: stories.status,
        created_at: stories.created_at,
        updated_at: stories.updated_at,
      })
      .from(stories)
      .where(eq(stories.story_id, story_id))
      .limit(1);

    if (result.length === 0) {
      return {
        success: false,
        error: `Story with ID '${story_id}' not found`,
      };
    }

    const row = result[0];
    return {
      success: true,
      data: {
        story_id: row.story_id,
        user_id: row.user_id,
        status: row.status as "processing" | "completed" | "failed",
        created_at: row.created_at.toISOString(),
        duplicate_remover_agent: {} as any,
        data_extractor_agent: {} as any,
        story_teller_agent: {} as any,
      },
    };
  } catch (error) {
    console.error("Error reading story metadata:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Utility function to check story processing status
 */
export async function getStoryStatus(
  story_id: string
): Promise<{ success: boolean; status?: string; error?: string }> {
  try {
    const result = await db
      .select({ status: stories.status })
      .from(stories)
      .where(eq(stories.story_id, story_id))
      .limit(1);

    if (result.length === 0) {
      return {
        success: false,
        error: `Story with ID '${story_id}' not found`,
      };
    }

    return {
      success: true,
      status: result[0].status,
    };
  } catch (error) {
    console.error("Error checking story status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
