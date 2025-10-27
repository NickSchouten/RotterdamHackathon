// TypeScript interfaces for Atlance story data model

export interface ImageData {
  path: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
  };
  subjects: string[];
}

export interface GoogleData {
  place: string;
  facts: string[];
  maps_pin: {
    lat: number;
    lng: number;
  };
}

export interface Question {
  question: string;
  answer: string;
}

export interface ImagePlacement {
  path: string;
  caption: string;
}

export interface DuplicateRemoverResult {
  original_count: number;
  unique_count: number;
  unique_images: string[];
}

export interface DataExtractorResult {
  images: ImageData[];
  google_data: GoogleData;
  preliminary_story: string;
}

export interface StoryTellerResult {
  questions: Question[];
  title: string;
  content: string;
  word_count: number;
  tone: string;
  images: ImagePlacement[];
}

export interface Story {
  story_id: string;
  user_id: string;
  status: "processing" | "completed" | "failed";
  created_at: string;
  duplicate_remover_agent: DuplicateRemoverResult;
  data_extractor_agent: DataExtractorResult;
  story_teller_agent: StoryTellerResult;
}

// Database table interfaces
export interface StoriesTable {
  story_id: string;
  user_id: string;
  status: "processing" | "completed" | "failed";
  created_at: Date;
  updated_at: Date;
}

export interface DuplicateRemoverResultsTable {
  id: number;
  story_id: string;
  original_count: number;
  unique_count: number;
  unique_images: string[]; // JSONB
}

export interface DataExtractorResultsTable {
  id: number;
  story_id: string;
  images_data: ImageData[]; // JSONB
  google_data: GoogleData; // JSONB
  preliminary_story: string;
}

export interface StoryTellerResultsTable {
  id: number;
  story_id: string;
  questions: Question[]; // JSONB
  title: string;
  content: string;
  word_count: number;
  tone: string;
  images: ImagePlacement[]; // JSONB
}

// MCP Tool parameter types
export interface WriteStoryParams {
  story_data: Story;
}

export interface ReadStoryParams {
  story_id: string;
}

export interface ListStoriesParams {
  user_id?: string;
  status?: "processing" | "completed" | "failed";
  limit?: number;
  offset?: number;
}

export interface UpdateStoryParams {
  story_id: string;
  updates: Partial<Story>;
}

export interface DeleteStoryParams {
  story_id: string;
  hard_delete?: boolean;
}

// Response types
export interface StoryResponse {
  success: boolean;
  data?: Story;
  error?: string;
}

export interface StoriesListResponse {
  success: boolean;
  data?: {
    stories: Story[];
    total: number;
    page: number;
    limit: number;
  };
  error?: string;
}

export interface OperationResponse {
  success: boolean;
  message: string;
  story_id?: string;
  error?: string;
}
