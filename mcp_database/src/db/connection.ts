import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { config } from "dotenv";

// Load environment variables
config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Parse database configuration from environment
const DB_POOL_MIN = parseInt(process.env.DB_POOL_MIN || "2", 10);
const DB_POOL_MAX = parseInt(process.env.DB_POOL_MAX || "10", 10);
const DB_TIMEOUT = parseInt(process.env.DB_TIMEOUT || "30000", 10);

// Create PostgreSQL connection with pooling
const sql = postgres(DATABASE_URL, {
  max: DB_POOL_MAX,
  idle_timeout: 20,
  connect_timeout: DB_TIMEOUT,
  ssl: process.env.NODE_ENV === "production" ? "require" : false,
  onnotice: process.env.NODE_ENV === "development" ? console.log : undefined,
});

// Create Drizzle database instance
export const db = drizzle(sql, { schema });

// Health check function
export async function healthCheck(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
}

// Graceful shutdown function
export async function closeConnection(): Promise<void> {
  try {
    await sql.end();
    console.log("Database connection closed gracefully");
  } catch (error) {
    console.error("Error closing database connection:", error);
  }
}

// Connection info for monitoring
export function getConnectionInfo() {
  return {
    poolMax: DB_POOL_MAX,
    poolMin: DB_POOL_MIN,
    timeout: DB_TIMEOUT,
    environment: process.env.NODE_ENV || "development",
  };
}

// Export the raw SQL connection for advanced queries if needed
export { sql };

// Handle process termination
process.on("SIGINT", async () => {
  console.log("Received SIGINT, closing database connection...");
  await closeConnection();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM, closing database connection...");
  await closeConnection();
  process.exit(0);
});
