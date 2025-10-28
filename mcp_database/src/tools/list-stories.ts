import { db } from "@/db/connection";
import { stories } from "@/db/schema";
import { eq, and, desc, asc, count } from "drizzle-orm";
import type {
  ListStoriesParams,
  StoriesListResponse,
  Story,
} from "@/types/story";
import { z } from "zod";

// Validation schema for list_stories parameters
const listStoriesSchema = z.object({
  user_id: z.string().optional(),
  status: z.enum(["processing", "completed", "failed"]).optional(),
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
  sort_by: z
    .enum(["created_at", "updated_at", "story_id"])
    .default("created_at"),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
});

/**
 * MCP Tool: list_stories
 * Lists stories with optional filtering and pagination
 */
export async function listStories(
  params: ListStoriesParams
): Promise<StoriesListResponse> {
  try {
    // Validate and set defaults for input parameters
    const validation = listStoriesSchema.safeParse(params);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors
          .map((e: any) => `${e.path.join(".")}: ${e.message}`)
          .join(", "),
      };
    }

    const { user_id, status, limit, offset, sort_by, sort_order } =
      validation.data;

    // Build dynamic WHERE conditions
    const conditions = [];
    if (user_id) {
      conditions.push(eq(stories.user_id, user_id));
    }
    if (status) {
      conditions.push(eq(stories.status, status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Determine sort column and direction
    const sortColumn = stories[sort_by as keyof typeof stories];
    const orderBy = sort_order === "asc" ? asc(sortColumn) : desc(sortColumn);

    // Get total count for pagination metadata
    const totalCountResult = await db
      .select({ count: count() })
      .from(stories)
      .where(whereClause);

    const totalCount = totalCountResult[0]?.count || 0;

    // Get paginated stories (metadata only for performance)
    const storiesResult = await db
      .select({
        story_id: stories.story_id,
        user_id: stories.user_id,
        status: stories.status,
        created_at: stories.created_at,
        updated_at: stories.updated_at,
      })
      .from(stories)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Convert to Story format (without agent data for performance)
    const storiesList: Story[] = storiesResult.map((row) => ({
      story_id: row.story_id,
      user_id: row.user_id,
      status: row.status as "processing" | "completed" | "failed",
      created_at: row.created_at.toISOString(),
      duplicate_remover_agent: {} as any, // Placeholder - not loaded for list view
      data_extractor_agent: {} as any, // Placeholder - not loaded for list view
      story_teller_agent: {} as any, // Placeholder - not loaded for list view
    }));

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    return {
      success: true,
      data: {
        stories: storiesList,
        total: totalCount,
        page: currentPage,
        limit: limit,
        total_pages: totalPages,
        has_next: currentPage < totalPages,
        has_previous: currentPage > 1,
      },
    };
  } catch (error) {
    console.error("Error listing stories from database:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Utility function to get stories count by status
 */
export async function getStoriesCountByStatus(user_id?: string): Promise<{
  success: boolean;
  data?: {
    processing: number;
    completed: number;
    failed: number;
    total: number;
  };
  error?: string;
}> {
  try {
    const conditions = user_id ? [eq(stories.user_id, user_id)] : [];
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const results = await db
      .select({
        status: stories.status,
        count: count(),
      })
      .from(stories)
      .where(whereClause)
      .groupBy(stories.status);

    const counts = {
      processing: 0,
      completed: 0,
      failed: 0,
      total: 0,
    };

    results.forEach((row) => {
      const statusCount = row.count || 0;
      counts[row.status as keyof typeof counts] = statusCount;
      counts.total += statusCount;
    });

    return {
      success: true,
      data: counts,
    };
  } catch (error) {
    console.error("Error getting stories count by status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Utility function to get recent stories for a user
 */
export async function getRecentStories(
  user_id: string,
  limit: number = 5
): Promise<StoriesListResponse> {
  return listStories({
    user_id,
    limit,
    offset: 0,
    sort_by: "created_at",
    sort_order: "desc",
  });
}

/**
 * Utility function to search stories by title or content (requires full-text search setup)
 * This is a simple implementation - for production, consider using PostgreSQL full-text search
 */
export async function searchStories(
  searchTerm: string,
  user_id?: string,
  limit: number = 10
): Promise<{
  success: boolean;
  data?: Story[];
  error?: string;
}> {
  try {
    // Note: This is a simplified search. For production, implement proper full-text search
    // using PostgreSQL's built-in search features or external search engines like Elasticsearch

    const conditions = [];
    if (user_id) {
      conditions.push(eq(stories.user_id, user_id));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const results = await db
      .select({
        story_id: stories.story_id,
        user_id: stories.user_id,
        status: stories.status,
        created_at: stories.created_at,
        updated_at: stories.updated_at,
      })
      .from(stories)
      .where(whereClause)
      .orderBy(desc(stories.created_at))
      .limit(limit);

    // Convert to Story format (metadata only)
    const searchResults: Story[] = results.map((row) => ({
      story_id: row.story_id,
      user_id: row.user_id,
      status: row.status as "processing" | "completed" | "failed",
      created_at: row.created_at.toISOString(),
      duplicate_remover_agent: {} as any,
      data_extractor_agent: {} as any,
      story_teller_agent: {} as any,
    }));

    return {
      success: true,
      data: searchResults,
    };
  } catch (error) {
    console.error("Error searching stories:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
