# MCP Server Database Plan

## Overview

Create a TypeScript Model Context Protocol (MCP) server that connects to Google Cloud PostgreSQL database using Drizzle ORM to store and retrieve Atlance travel stories data.

## 1. Project Setup & Dependencies

### Core Dependencies

- `@modelcontextprotocol/sdk` - MCP SDK for TypeScript
- `drizzle-orm` - Modern TypeScript ORM
- `drizzle-kit` - Database migrations and introspection
- `postgres` - PostgreSQL driver for Node.js
- `pg` - Additional PostgreSQL client
- `@types/pg` - TypeScript types for pg

### Development Dependencies

- `typescript` - TypeScript compiler
- `tsx` - TypeScript execution environment
- `@types/node` - Node.js TypeScript types
- `dotenv` - Environment variable management

### Project Structure

```
mcp_database/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── db/
│   │   ├── connection.ts     # Database connection setup
│   │   ├── schema.ts         # Drizzle schema definitions
│   │   └── migrations/       # Database migration files
│   ├── tools/
│   │   ├── write-story.ts    # Tool to write story data
│   │   ├── read-story.ts     # Tool to read story data
│   │   ├── list-stories.ts   # Tool to list all stories
│   │   └── update-story.ts   # Tool to update story data
│   └── types/
│       └── story.ts          # TypeScript interfaces
├── drizzle.config.ts         # Drizzle configuration
├── package.json
├── tsconfig.json
└── .env                      # Environment variables
```

## 2. Database Schema Design

### Core Tables Based on story_datamodel.json

#### `stories` Table (Main story metadata)

- `story_id` (PRIMARY KEY, VARCHAR)
- `user_id` (VARCHAR, NOT NULL)
- `status` (ENUM: processing, completed, failed)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `duplicate_remover_results` Table

- `id` (SERIAL PRIMARY KEY)
- `story_id` (VARCHAR, FOREIGN KEY)
- `original_count` (INTEGER)
- `unique_count` (INTEGER)
- `unique_images` (JSONB) - Array of image paths

#### `data_extractor_results` Table

- `id` (SERIAL PRIMARY KEY)
- `story_id` (VARCHAR, FOREIGN KEY)
- `images_data` (JSONB) - Array of image objects with metadata
- `google_data` (JSONB) - Google Maps/Search results
- `preliminary_story` (TEXT)

#### `story_teller_results` Table

- `id` (SERIAL PRIMARY KEY)
- `story_id` (VARCHAR, FOREIGN KEY)
- `questions` (JSONB) - Array of Q&A objects
- `title` (VARCHAR)
- `content` (TEXT)
- `word_count` (INTEGER)
- `tone` (VARCHAR)
- `images` (JSONB) - Array of image placement objects

### Indexes for Performance

- Index on `story_id` across all tables
- Index on `user_id` in stories table
- Index on `status` in stories table
- Index on `created_at` for chronological queries

## 3. Drizzle ORM Schema Implementation

### Schema Definition Strategy

- Use Drizzle's PostgreSQL schema builder
- Define relations between tables using foreign keys
- Use JSONB for complex nested objects (images, questions, google_data)
- Implement proper TypeScript types for all fields
- Add database constraints and validations

### Migration Strategy

- Create initial migration for all tables
- Use Drizzle Kit for schema generation and migrations
- Version control all migration files
- Include rollback scripts for each migration

## 4. MCP Tools Implementation

### Tool 1: `write_story`

**Purpose**: Insert a complete story record into the database
**Parameters**:

- `story_data` (object) - Complete story object matching story_datamodel.json structure
  **Functionality**:
- Validate input data against TypeScript interfaces
- Begin database transaction
- Insert into `stories` table
- Insert into `duplicate_remover_results` table
- Insert into `data_extractor_results` table
- Insert into `story_teller_results` table
- Commit transaction or rollback on error
- Return success/failure response with story_id

### Tool 2: `read_story`

**Purpose**: Retrieve a complete story by story_id
**Parameters**:

- `story_id` (string) - Unique story identifier
  **Functionality**:
- Query all related tables using JOIN operations
- Reconstruct complete story object
- Return formatted response matching story_datamodel.json structure
- Handle not found cases gracefully

### Tool 3: `list_stories`

**Purpose**: List stories with optional filtering
**Parameters**:

- `user_id` (optional string) - Filter by user
- `status` (optional string) - Filter by processing status
- `limit` (optional number) - Pagination limit (default: 10)
- `offset` (optional number) - Pagination offset (default: 0)
  **Functionality**:
- Build dynamic query based on filters
- Return paginated list of story summaries
- Include metadata counts (total stories, pages)

### Tool 4: `update_story`

**Purpose**: Update specific fields of an existing story
**Parameters**:

- `story_id` (string) - Story to update
- `updates` (object) - Partial story data to update
  **Functionality**:
- Validate story exists
- Determine which tables need updates based on provided data
- Update relevant tables atomically
- Update `updated_at` timestamp
- Return updated story data

### Tool 5: `delete_story`

**Purpose**: Soft delete or hard delete a story
**Parameters**:

- `story_id` (string) - Story to delete
- `hard_delete` (optional boolean) - Whether to permanently delete
  **Functionality**:
- If soft delete: update status to 'deleted'
- If hard delete: remove from all related tables
- Return confirmation of deletion

## 5. Database Connection & Configuration

### Google Cloud PostgreSQL Setup

- Configure connection pooling for optimal performance
- Use connection string with SSL requirements
- Implement retry logic for connection failures
- Set appropriate timeouts and connection limits

### Environment Variables

```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
GOOGLE_CLOUD_PROJECT_ID=your-project-id
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_TIMEOUT=30000
```

### Connection Management

- Use connection pooling with graceful shutdown
- Implement health check endpoint
- Add database migration runner
- Include connection monitoring and logging

## 6. Error Handling & Validation

### Input Validation

- Validate all tool parameters against TypeScript interfaces
- Check required fields and data types
- Validate story_id format and existence
- Sanitize inputs to prevent SQL injection

### Error Response Strategy

- Standardized error response format
- Detailed error messages for development
- Generic error messages for production
- Proper HTTP status codes and MCP error types

### Database Error Handling

- Connection timeout handling
- Transaction rollback on failures
- Duplicate key constraint handling
- Foreign key constraint violations

## 7. Testing Strategy

### Unit Tests

- Test each MCP tool individually
- Mock database connections for isolated testing
- Test error scenarios and edge cases
- Validate TypeScript type safety

### Integration Tests

- Test complete story lifecycle (write → read → update → delete)
- Test database transactions and rollbacks
- Test connection pooling and recovery
- Validate data integrity across related tables

### Performance Tests

- Load testing with multiple concurrent requests
- Database query performance benchmarking
- Memory usage monitoring during large data operations
- Connection pool stress testing

## 8. Deployment & Monitoring

### Deployment Preparation

- Build process for TypeScript compilation
- Environment-specific configuration
- Database migration execution
- Health check implementation

### Monitoring & Logging

- Database query performance logging
- Error rate monitoring
- Connection pool metrics
- Tool usage analytics

### Security Considerations

- Database credentials management
- SQL injection prevention
- Input sanitization
- Connection encryption

## 9. Documentation

### API Documentation

- Complete MCP tool documentation
- Parameter specifications and examples
- Error response documentation
- Usage examples for each tool

### Database Documentation

- Schema diagram and relationships
- Migration history and procedures
- Performance optimization guidelines
- Backup and recovery procedures

## 10. Future Enhancements

### Potential Improvements

- Real-time story updates using database triggers
- Full-text search capabilities for story content
- Data archiving for old stories
- Read replicas for improved read performance
- Caching layer for frequently accessed stories
- Bulk operations for multiple stories
- Story analytics and reporting tools
