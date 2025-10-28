# 🚀 Atlance MCP Database Server - Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- pnpm package manager
- Google Cloud SQL instance running
- Cloud SQL Proxy or direct database access

## Installation & Setup

### 1. Install Dependencies

```bash
cd mcp_database
pnpm install
```

### 2. Configure Database Connection

Create a `.env` file in the `mcp_database` directory:

```env
DATABASE_URL="postgresql://postgres:_Mypass_1234@localhost:5433/atlance"
```

**For Cloud SQL Proxy Connection:**

Start the Cloud SQL Proxy in a separate terminal:

```bash
cloud-sql-proxy qwiklabs-gcp-00-cf7331a99e6b:europe-west1:hackathon --port 5433
```

Then use `localhost:5433` in your DATABASE_URL (as shown above).

**For Direct Connection:**

If using a public IP, update the DATABASE_URL:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@YOUR_PUBLIC_IP:5432/atlance?sslmode=require"
```

### 3. Create Database Tables

```bash
pnpm db:push
```

This will create all necessary tables in your database:
- `stories` - Main story data
- `duplicate_remover_results` - Duplicate detection results
- `data_extractor_results` - Extracted data from stories
- `story_teller_results` - Story narrative and questions

### 4. Start the MCP Server

**Development mode:**
```bash
pnpm dev
```

**Production mode:**
```bash
pnpm build
pnpm start
```

## 🔧 Using the MCP Server

### Option 1: With Claude Desktop

**Configure Claude Desktop:**

Edit your Claude Desktop config file:

**Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

**Linux:** `~/.config/Claude/claude_desktop_config.json`

Add this configuration:

```json
{
  "mcpServers": {
    "atlance-database": {
      "command": "npx",
      "args": [
        "tsx",
        "/Users/robbiebardijn/Documents/BUSINESS/RotterdamHackathon/mcp_database/src/index.ts"
      ],
      "env": {
        "DATABASE_URL": "postgresql://postgres:_Mypass_1234@localhost:5433/atlance"
      }
    }
  }
}
```

**Important:** Update the absolute path to match your system.

**Restart Claude Desktop** and you can now use natural language to interact with your database:

```
"Write a new story to the database with title 'Paris Weekend' and location 'Paris, France'"

"List all stories for user_123"

"Read story with ID story_001"

"Update story story_001 and set status to completed"

"Delete story story_002"
```

### Option 2: With MCP Inspector (For Testing)

```bash
# Install MCP Inspector globally
npm install -g @modelcontextprotocol/inspector

# Run inspector
mcp-inspector npx tsx src/index.ts
```

This opens a web UI where you can test all tools interactively.

### Option 3: Programmatic Usage

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "npx",
  args: ["tsx", "src/index.ts"]
});

const client = new Client({
  name: "atlance-client",
  version: "1.0.0"
}, {
  capabilities: {}
});

await client.connect(transport);

// Call a tool
const result = await client.callTool({
  name: "list_stories",
  arguments: {
    user_id: "user_123",
    limit: 10
  }
});

console.log(result);
```

## 🛠️ Available Tools

Your MCP server provides 5 tools for managing travel stories:

### 1. **write_story**
Insert a complete story with all agent processing data.

**Example:**
```json
{
  "story_id": "story_001_paris_weekend",
  "user_id": "user_123",
  "title": "Weekend in Paris",
  "location": "Paris, France",
  "duplicate_remover": {
    "is_duplicate": false,
    "similarity_score": 0.15
  },
  "data_extractor": {
    "extracted_data": {
      "people": ["Marie", "Jean"],
      "places": ["Eiffel Tower", "Louvre"],
      "dates": ["2024-03-15", "2024-03-17"]
    },
    "confidence_score": 0.92
  },
  "story_teller": {
    "questions": ["What was your favorite moment?"],
    "narrative": "A beautiful weekend exploring Paris...",
    "writing_style": "descriptive",
    "tone": "enthusiastic"
  }
}
```

### 2. **read_story**
Retrieve a story by its ID.

**Example:**
```json
{
  "story_id": "story_001_paris_weekend"
}
```

### 3. **list_stories**
List stories with filtering and pagination.

**Example:**
```json
{
  "user_id": "user_123",
  "location": "Paris",
  "limit": 10,
  "offset": 0
}
```

### 4. **update_story**
Update specific fields of an existing story.

**Example:**
```json
{
  "story_id": "story_001_paris_weekend",
  "title": "Amazing Paris Weekend",
  "story_teller": {
    "narrative": "Updated narrative text..."
  }
}
```

### 5. **delete_story**
Delete a story (soft delete by default).

**Example:**
```json
{
  "story_id": "story_001_paris_weekend",
  "hard_delete": false
}
```

## 🔍 Additional Commands

### View Database Schema
```bash
pnpm db:studio
```

Opens Drizzle Studio in your browser to explore the database.

### Generate Migrations (if needed)
```bash
pnpm db:generate
```

### Run Tests
```bash
pnpm test
```

### Lint Code
```bash
pnpm lint
pnpm lint:fix
```

## 🐛 Troubleshooting

### Connection Timeout Errors

If you see `ETIMEDOUT` errors:

1. **Ensure Cloud SQL Proxy is running:**
   ```bash
   cloud-sql-proxy qwiklabs-gcp-00-cf7331a99e6b:europe-west1:hackathon --port 5433
   ```

2. **Check your DATABASE_URL** matches the proxy port (5433)

3. **Verify database credentials** are correct

### "Cannot read properties of undefined" Errors

This means the DATABASE_URL environment variable is not loaded:

1. **Ensure `.env` file exists** in the `mcp_database` directory
2. **Verify dotenv is installed:** `pnpm install dotenv`
3. **Check `.env` syntax** - no spaces around `=`, quotes around URL

### Connection Refused

If the database refuses connections:

1. **Whitelist your IP** in Google Cloud SQL
2. **Enable Public IP** on your Cloud SQL instance
3. **Use Cloud SQL Proxy** instead of direct connection

## 📚 Next Steps

- Read the full [PLAN.md](PLAN.md) for architecture details
- Check [story_datamodel.json](story_datamodel.json) for example data
- Review individual tool implementations in `src/tools/`
- Set up monitoring and logging (see TODO list)

## 🎯 Production Deployment

For production deployment:

1. Build the TypeScript code:
   ```bash
   pnpm build
   ```

2. Set up environment variables in your production environment

3. Run the compiled JavaScript:
   ```bash
   pnpm start
   ```

4. Configure your MCP client to use the production server path

---

**Need help?** Check the main [README.md](README.md) or refer to the [MCP documentation](https://modelcontextprotocol.io).
```bash
pnpm test
```

### Lint Code
```bash
pnpm lint
pnpm lint:fix
```

## 🐛 Troubleshooting

### Connection Timeout Errors

If you see `ETIMEDOUT` errors:

1. **Ensure Cloud SQL Proxy is running:**
   ```bash
   cloud-sql-proxy qwiklabs-gcp-00-cf7331a99e6b:europe-west1:hackathon --port 5433
   ```

2. **Check your DATABASE_URL** matches the proxy port (5433)

3. **Verify database credentials** are correct

### "Cannot read properties of undefined" Errors

This means the DATABASE_URL environment variable is not loaded:

1. **Ensure `.env` file exists** in the `mcp_database` directory
2. **Verify dotenv is installed:** `pnpm install dotenv`
3. **Check `.env` syntax** - no spaces around `=`, quotes around URL

### Connection Refused

If the database refuses connections:

1. **Whitelist your IP** in Google Cloud SQL
2. **Enable Public IP** on your Cloud SQL instance
3. **Use Cloud SQL Proxy** instead of direct connection

## 📚 Next Steps

- Read the full [PLAN.md](PLAN.md) for architecture details
- Check [story_datamodel.json](story_datamodel.json) for example data
- Review individual tool implementations in `src/tools/`
- Set up monitoring and logging (see TODO list)

## 🎯 Production Deployment

For production deployment:

1. Build the TypeScript code:
   ```bash
   pnpm build
   ```

2. Set up environment variables in your production environment

3. Run the compiled JavaScript:
   ```bash
   pnpm start
   ```

4. Configure your MCP client to use the production server path

---

**Need help?** Check the main [README.md](README.md) or refer to the [MCP documentation](https://modelcontextprotocol.io).

```bash
# Development mode with hot reload
pnpm dev

# Production mode
pnpm build && pnpm start
```

## 🛠️ MCP Tools Usage

### 1. write_story

Insert a complete story into the database:

```json
{
  "story_data": {
    "story_id": "story_001_paris_weekend",
    "user_id": "user_123",
    "status": "completed",
    "created_at": "2024-10-25T14:30:00Z",
    "duplicate_remover_agent": {
      "original_count": 47,
      "unique_count": 12,
      "unique_images": ["/photos/eiffel_tower.jpg", "/photos/louvre.jpg"]
    },
    "data_extractor_agent": {
      "images": [
        {
          "path": "/photos/eiffel_tower.jpg",
          "timestamp": "2024-10-20T18:45:00Z",
          "location": { "lat": 48.8584, "lng": 2.2945 },
          "subjects": ["Eiffel Tower", "sunset", "people"]
        }
      ],
      "google_data": {
        "place": "Eiffel Tower, Paris",
        "facts": ["Built in 1889", "324 meters tall"],
        "maps_pin": { "lat": 48.8584, "lng": 2.2945 }
      },
      "preliminary_story": "A romantic weekend in Paris..."
    },
    "story_teller_agent": {
      "questions": [
        {
          "question": "Was this for a special occasion?",
          "answer": "Yes, our 5th anniversary!"
        }
      ],
      "title": "Five Perfect Days in Paris",
      "content": "# Five Perfect Days in Paris\n\nParis welcomed us...",
      "word_count": 156,
      "tone": "romantic",
      "images": [
        {
          "path": "/photos/eiffel_tower.jpg",
          "caption": "Our anniversary moment"
        }
      ]
    }
  }
}
```

### 2. read_story

Retrieve a story by ID:

```json
{
  "story_id": "story_001_paris_weekend"
}
```

### 3. list_stories

List stories with filtering:

```json
{
  "user_id": "user_123",
  "status": "completed",
  "limit": 10,
  "offset": 0,
  "sort_by": "created_at",
  "sort_order": "desc"
}
```

### 4. update_story

Update specific fields:

```json
{
  "story_id": "story_001_paris_weekend",
  "updates": {
    "status": "completed",
    "story_teller_agent": {
      "title": "Updated Title"
    }
  }
}
```

### 5. delete_story

Delete a story (soft or hard delete):

```json
{
  "story_id": "story_001_paris_weekend",
  "hard_delete": false
}
```

## 📊 Database Schema

### Tables

- **stories** - Main story metadata
- **duplicate_remover_results** - Duplicate removal agent results
- **data_extractor_results** - Data extraction agent results
- **story_teller_results** - Story generation agent results

### Relationships

All agent result tables have foreign keys to the main `stories` table with cascade delete.

## 🔧 Development Commands

```bash
# Database operations
pnpm db:generate    # Generate migrations from schema changes
pnpm db:migrate     # Apply migrations to database
pnpm db:studio      # Open Drizzle Studio (database GUI)

# Development
pnpm dev           # Start with hot reload
pnpm build         # Build for production
pnpm start         # Start production server

# Code quality
pnpm lint          # Run ESLint
pnpm lint:fix      # Fix ESLint issues
pnpm test          # Run tests (when implemented)
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Fails**

   - Check your `DATABASE_URL` in `.env`
   - Ensure PostgreSQL is running and accessible
   - Verify SSL settings match your database configuration

2. **Module Not Found Errors**

   - Run `pnpm install` to ensure all dependencies are installed
   - Check that you're using Node.js 18+

3. **Migration Errors**
   - Ensure database exists and is accessible
   - Check that user has proper permissions
   - Review migration files in `src/db/migrations/`

### Health Check

The server includes a built-in health check that runs on startup. If it fails, check:

- Database connectivity
- Environment variables
- Network access to database

## 🔐 Security Notes

- Always use environment variables for sensitive data
- Enable SSL for production database connections
- Implement proper authentication in production
- Regularly update dependencies for security patches

## 📈 Performance Tips

- Use connection pooling (configured via environment variables)
- Consider read replicas for heavy read workloads
- Monitor query performance with `pnpm db:studio`
- Add indexes for frequently queried fields

## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Use secure `DATABASE_URL` with SSL
3. Configure proper logging levels
4. Set up monitoring and alerting
5. Implement backup strategies
6. Use process managers like PM2 or Docker

## 📚 Next Steps

1. Run `pnpm install` to install dependencies
2. Configure your database connection
3. Run migrations to set up the schema
4. Test with sample data using the provided examples
5. Integrate with your Atlance application

For more detailed information, see the complete README.md and PLAN.md files.
