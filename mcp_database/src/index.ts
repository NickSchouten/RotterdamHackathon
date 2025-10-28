#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { config } from "dotenv";
import { healthCheck, getConnectionInfo } from "@/db/connection";
import { writeStory } from "@/tools/write-story";
import { readStory } from "@/tools/read-story";
import { listStories } from "@/tools/list-stories";
import { updateStory } from "@/tools/update-story";
import { deleteStory } from "@/tools/delete-story";

// Load environment variables
config();

// Server configuration
const SERVER_NAME = process.env.MCP_SERVER_NAME || "atlance-database";
const SERVER_VERSION = process.env.MCP_SERVER_VERSION || "1.0.0";

// Create MCP server instance
const server = new Server(
  {
    name: SERVER_NAME,
    version: SERVER_VERSION,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions
const TOOLS = [
  {
    name: "write_story",
    description:
      "Insert a complete story record into the database with all agent results",
    inputSchema: {
      type: "object",
      properties: {
        story_data: {
          type: "object",
          description: "Complete story object matching the Atlance data model",
          properties: {
            story_id: {
              type: "string",
              description: "Unique story identifier",
            },
            user_id: {
              type: "string",
              description: "User who owns this story",
            },
            status: {
              type: "string",
              enum: ["processing", "completed", "failed"],
              description: "Current processing status",
            },
            created_at: {
              type: "string",
              description: "ISO timestamp when story was created",
            },
            duplicate_remover_agent: {
              type: "object",
              properties: {
                original_count: {
                  type: "number",
                  description: "Number of original images",
                },
                unique_count: {
                  type: "number",
                  description: "Number of unique images after deduplication",
                },
                unique_images: {
                  type: "array",
                  items: { type: "string" },
                  description: "Paths to unique images",
                },
              },
              required: ["original_count", "unique_count", "unique_images"],
            },
            data_extractor_agent: {
              type: "object",
              properties: {
                images: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      path: { type: "string" },
                      timestamp: { type: "string" },
                      location: {
                        type: "object",
                        properties: {
                          lat: { type: "number", minimum: -90, maximum: 90 },
                          lng: { type: "number", minimum: -180, maximum: 180 },
                        },
                        required: ["lat", "lng"],
                      },
                      subjects: { type: "array", items: { type: "string" } },
                    },
                    required: ["path", "timestamp", "location", "subjects"],
                  },
                },
                google_data: {
                  type: "object",
                  properties: {
                    place: { type: "string" },
                    facts: { type: "array", items: { type: "string" } },
                    maps_pin: {
                      type: "object",
                      properties: {
                        lat: { type: "number", minimum: -90, maximum: 90 },
                        lng: { type: "number", minimum: -180, maximum: 180 },
                      },
                      required: ["lat", "lng"],
                    },
                  },
                  required: ["place", "facts", "maps_pin"],
                },
                preliminary_story: { type: "string" },
              },
              required: ["images", "google_data", "preliminary_story"],
            },
            story_teller_agent: {
              type: "object",
              properties: {
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      question: { type: "string" },
                      answer: { type: "string" },
                    },
                    required: ["question", "answer"],
                  },
                },
                title: { type: "string" },
                content: { type: "string" },
                word_count: { type: "number", minimum: 0 },
                tone: { type: "string" },
                images: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      path: { type: "string" },
                      caption: { type: "string" },
                    },
                    required: ["path", "caption"],
                  },
                },
              },
              required: [
                "questions",
                "title",
                "content",
                "word_count",
                "tone",
                "images",
              ],
            },
          },
          required: [
            "story_id",
            "user_id",
            "status",
            "created_at",
            "duplicate_remover_agent",
            "data_extractor_agent",
            "story_teller_agent",
          ],
        },
      },
      required: ["story_data"],
    },
  },
  {
    name: "read_story",
    description: "Retrieve a complete story by story_id",
    inputSchema: {
      type: "object",
      properties: {
        story_id: {
          type: "string",
          description: "Unique story identifier to retrieve",
        },
      },
      required: ["story_id"],
    },
  },
  {
    name: "list_stories",
    description: "List stories with optional filtering and pagination",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
          description: "Filter stories by user ID (optional)",
        },
        status: {
          type: "string",
          enum: ["processing", "completed", "failed"],
          description: "Filter stories by processing status (optional)",
        },
        limit: {
          type: "number",
          minimum: 1,
          maximum: 100,
          default: 10,
          description: "Maximum number of stories to return",
        },
        offset: {
          type: "number",
          minimum: 0,
          default: 0,
          description: "Number of stories to skip for pagination",
        },
        sort_by: {
          type: "string",
          enum: ["created_at", "updated_at", "story_id"],
          default: "created_at",
          description: "Field to sort by",
        },
        sort_order: {
          type: "string",
          enum: ["asc", "desc"],
          default: "desc",
          description: "Sort order",
        },
      },
    },
  },
  {
    name: "update_story",
    description: "Update specific fields of an existing story",
    inputSchema: {
      type: "object",
      properties: {
        story_id: {
          type: "string",
          description: "Unique story identifier to update",
        },
        updates: {
          type: "object",
          description:
            "Partial story data to update (only specified fields will be updated)",
          properties: {
            user_id: { type: "string" },
            status: {
              type: "string",
              enum: ["processing", "completed", "failed"],
            },
            duplicate_remover_agent: { type: "object" },
            data_extractor_agent: { type: "object" },
            story_teller_agent: { type: "object" },
          },
        },
      },
      required: ["story_id", "updates"],
    },
  },
  {
    name: "delete_story",
    description: "Soft delete or permanently delete a story",
    inputSchema: {
      type: "object",
      properties: {
        story_id: {
          type: "string",
          description: "Unique story identifier to delete",
        },
        hard_delete: {
          type: "boolean",
          default: false,
          description:
            "If true, permanently delete from database. If false, mark as deleted (soft delete)",
        },
      },
      required: ["story_id"],
    },
  },
];

// Register list_tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

// Register call_tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "write_story":
        const writeResult = await writeStory(args as any);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(writeResult, null, 2),
            },
          ],
        };

      case "read_story":
        const readResult = await readStory(args as any);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(readResult, null, 2),
            },
          ],
        };

      case "list_stories":
        const listResult = await listStories(args as any);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(listResult, null, 2),
            },
          ],
        };

      case "update_story":
        const updateResult = await updateStory(args as any);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(updateResult, null, 2),
            },
          ],
        };

      case "delete_story":
        const deleteResult = await deleteStory(args as any);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(deleteResult, null, 2),
            },
          ],
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    console.error(`Error executing tool ${name}:`, error);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Unknown error occurred",
              tool: name,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
});

// Health check and startup
async function startServer() {
  try {
    // Check database connection
    const isHealthy = await healthCheck();
    if (!isHealthy) {
      console.error(
        "Database health check failed. Please check your database connection."
      );
      process.exit(1);
    }

    console.log("✅ Database connection healthy");
    console.log(
      "📊 Connection info:",
      JSON.stringify(getConnectionInfo(), null, 2)
    );
    console.log(`🚀 Starting ${SERVER_NAME} v${SERVER_VERSION}`);
    console.log("📋 Available tools:", TOOLS.map((t) => t.name).join(", "));

    // Start the server
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.log("✅ MCP server started successfully");
  } catch (error) {
    console.error("❌ Failed to start MCP server:", error);
    process.exit(1);
  }
}

// Graceful shutdown handling
process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully...");
  process.exit(0);
});

// Start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer().catch((error) => {
    console.error("💥 Server startup failed:", error);
    process.exit(1);
  });
}
