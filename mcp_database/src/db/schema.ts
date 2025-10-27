import {
  pgTable,
  varchar,
  integer,
  timestamp,
  serial,
  text,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import type {
  ImageData,
  GoogleData,
  Question,
  ImagePlacement,
} from "@/types/story";

// Main stories table
export const stories = pgTable(
  "stories",
  {
    story_id: varchar("story_id", { length: 255 }).primaryKey(),
    user_id: varchar("user_id", { length: 255 }).notNull(),
    status: varchar("status", { length: 50 }).notNull().default("processing"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("stories_user_id_idx").on(table.user_id),
    statusIdx: index("stories_status_idx").on(table.status),
    createdAtIdx: index("stories_created_at_idx").on(table.created_at),
  })
);

// Duplicate remover results table
export const duplicateRemoverResults = pgTable(
  "duplicate_remover_results",
  {
    id: serial("id").primaryKey(),
    story_id: varchar("story_id", { length: 255 })
      .notNull()
      .references(() => stories.story_id, { onDelete: "cascade" }),
    original_count: integer("original_count").notNull(),
    unique_count: integer("unique_count").notNull(),
    unique_images: jsonb("unique_images").$type<string[]>().notNull(),
  },
  (table) => ({
    storyIdIdx: index("duplicate_remover_story_id_idx").on(table.story_id),
  })
);

// Data extractor results table
export const dataExtractorResults = pgTable(
  "data_extractor_results",
  {
    id: serial("id").primaryKey(),
    story_id: varchar("story_id", { length: 255 })
      .notNull()
      .references(() => stories.story_id, { onDelete: "cascade" }),
    images_data: jsonb("images_data").$type<ImageData[]>().notNull(),
    google_data: jsonb("google_data").$type<GoogleData>().notNull(),
    preliminary_story: text("preliminary_story").notNull(),
  },
  (table) => ({
    storyIdIdx: index("data_extractor_story_id_idx").on(table.story_id),
  })
);

// Story teller results table
export const storyTellerResults = pgTable(
  "story_teller_results",
  {
    id: serial("id").primaryKey(),
    story_id: varchar("story_id", { length: 255 })
      .notNull()
      .references(() => stories.story_id, { onDelete: "cascade" }),
    questions: jsonb("questions").$type<Question[]>().notNull(),
    title: varchar("title", { length: 500 }).notNull(),
    content: text("content").notNull(),
    word_count: integer("word_count").notNull(),
    tone: varchar("tone", { length: 100 }).notNull(),
    images: jsonb("images").$type<ImagePlacement[]>().notNull(),
  },
  (table) => ({
    storyIdIdx: index("story_teller_story_id_idx").on(table.story_id),
  })
);

// Define relationships for better type inference
export const storiesRelations = {
  duplicateRemoverResults: {
    table: duplicateRemoverResults,
    fields: [stories.story_id],
    references: [duplicateRemoverResults.story_id],
  },
  dataExtractorResults: {
    table: dataExtractorResults,
    fields: [stories.story_id],
    references: [dataExtractorResults.story_id],
  },
  storyTellerResults: {
    table: storyTellerResults,
    fields: [stories.story_id],
    references: [storyTellerResults.story_id],
  },
};

// Export table types for use in queries
export type Story = typeof stories.$inferSelect;
export type NewStory = typeof stories.$inferInsert;

export type DuplicateRemoverResult =
  typeof duplicateRemoverResults.$inferSelect;
export type NewDuplicateRemoverResult =
  typeof duplicateRemoverResults.$inferInsert;

export type DataExtractorResult = typeof dataExtractorResults.$inferSelect;
export type NewDataExtractorResult = typeof dataExtractorResults.$inferInsert;

export type StoryTellerResult = typeof storyTellerResults.$inferSelect;
export type NewStoryTellerResult = typeof storyTellerResults.$inferInsert;
