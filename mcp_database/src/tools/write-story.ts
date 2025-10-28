import { db } from "@/db/connection";
import {
  stories,
  duplicateRemoverResults,
  dataExtractorResults,
  storyTellerResults,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import type { WriteStoryParams, OperationResponse, Story } from "@/types/story";
import { z } from "zod";

// Validation schema for write_story parameters
const writeStorySchema = z.object({
  story_data: z.object({
    story_id: z.string().min(1, "Story ID is required"),
    user_id: z.string().min(1, "User ID is required"),
    status: z.enum(["processing", "completed", "failed"]),
    created_at: z.string(),
    duplicate_remover_agent: z.object({
      original_count: z.number().min(0),
      unique_count: z.number().min(0),
      unique_images: z.array(z.string()),
    }),
    data_extractor_agent: z.object({
      images: z.array(
        z.object({
          path: z.string(),
          timestamp: z.string(),
          location: z.object({
            lat: z.number().min(-90).max(90),
            lng: z.number().min(-180).max(180),
          }),
          subjects: z.array(z.string()),
        })
      ),
      google_data: z.object({
        place: z.string(),
        facts: z.array(z.string()),
        maps_pin: z.object({
          lat: z.number().min(-90).max(90),
          lng: z.number().min(-180).max(180),
        }),
      }),
      preliminary_story: z.string(),
    }),
    story_teller_agent: z.object({
      questions: z.array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      ),
      title: z.string().min(1, "Title is required"),
      content: z.string().min(1, "Content is required"),
      word_count: z.number().min(0),
      tone: z.string(),
      images: z.array(
        z.object({
          path: z.string(),
          caption: z.string(),
        })
      ),
    }),
  }),
});

/**
 * MCP Tool: write_story
 * Inserts a complete story record into the database with transaction support
 */
export async function writeStory(
  params: WriteStoryParams
): Promise<OperationResponse> {
  try {
    // Validate input parameters
    const validation = writeStorySchema.safeParse(params);
    if (!validation.success) {
      return {
        success: false,
        message: "Invalid input parameters",
        error: validation.error.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", "),
      };
    }

    const { story_data } = validation.data;

    // Start database transaction
    const result = await db.transaction(async (tx) => {
      // 1. Insert main story record
      await tx.insert(stories).values({
        story_id: story_data.story_id,
        user_id: story_data.user_id,
        status: story_data.status,
        created_at: new Date(story_data.created_at),
        updated_at: new Date(),
      });

      // 2. Insert duplicate remover results
      await tx.insert(duplicateRemoverResults).values({
        story_id: story_data.story_id,
        original_count: story_data.duplicate_remover_agent.original_count,
        unique_count: story_data.duplicate_remover_agent.unique_count,
        unique_images: story_data.duplicate_remover_agent.unique_images,
      });

      // 3. Insert data extractor results
      await tx.insert(dataExtractorResults).values({
        story_id: story_data.story_id,
        images_data: story_data.data_extractor_agent.images,
        google_data: story_data.data_extractor_agent.google_data,
        preliminary_story: story_data.data_extractor_agent.preliminary_story,
      });

      // 4. Insert story teller results
      await tx.insert(storyTellerResults).values({
        story_id: story_data.story_id,
        questions: story_data.story_teller_agent.questions,
        title: story_data.story_teller_agent.title,
        content: story_data.story_teller_agent.content,
        word_count: story_data.story_teller_agent.word_count,
        tone: story_data.story_teller_agent.tone,
        images: story_data.story_teller_agent.images,
      });

      return story_data.story_id;
    });

    return {
      success: true,
      message: "Story successfully written to database",
      story_id: result,
    };
  } catch (error) {
    // Handle specific database errors
    if (error instanceof Error) {
      // Check for duplicate key violation
      if (error.message.includes("duplicate key")) {
        return {
          success: false,
          message: "Story already exists",
          error: `Story with ID ${params.story_data.story_id} already exists in database`,
        };
      }

      // Check for foreign key violation
      if (error.message.includes("foreign key")) {
        return {
          success: false,
          message: "Foreign key constraint violation",
          error: error.message,
        };
      }
    }

    console.error("Error writing story to database:", error);
    return {
      success: false,
      message: "Failed to write story to database",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Utility function to validate story_id format
 */
export function validateStoryId(story_id: string): boolean {
  // Story ID should be non-empty string, optionally with specific format
  return (
    typeof story_id === "string" &&
    story_id.length > 0 &&
    story_id.length <= 255
  );
}

/**
 * Utility function to check if story exists
 */
export async function storyExists(story_id: string): Promise<boolean> {
  try {
    const result = await db
      .select({ story_id: stories.story_id })
      .from(stories)
      .where(eq(stories.story_id, story_id))
      .limit(1);

    return result.length > 0;
  } catch (error) {
    console.error("Error checking story existence:", error);
    return false;
  }
}
