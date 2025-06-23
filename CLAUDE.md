# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Discord bot called sushii, built with Discord.js and Bun. It's a TypeScript monorepo that migrated from Rust back to Discord.js for ease of use with Discord interactions.

## Workspace Structure

This is a bun workspaces monorepo with the following packages:

- `sushii-worker` - Main Discord bot application
- `sushii-data` - GraphQL API server with PostGraphile 
- `sushii-db` - Database migrations and schema

## Development Commands

### Root Level Commands
```bash
# Start both data and worker services in development
bun dev

# Start individual services
bun dev:data
bun dev:worker

# Run tests for worker package
bun test:worker
```

### Package-Specific Commands

#### sushii-worker (Main Bot)
```bash
cd packages/sushii-worker

# Development with pretty logging
bun dev

# Run tests
bun test

# Type checking
bun typecheck

# Generate database types from schema
bun codegen:pg

# Linting (when available)
bun lint
```

#### sushii-data (GraphQL API)
```bash
cd packages/sushii-data

# Development with pretty logging
bun dev

# Build
bun build

# Testing
bun test
bun test:watch
bun test:cov

# Linting and formatting
bun lint
bun format
```

## Architecture

### Database Layer
- Uses Kysely for type-safe SQL queries
- Repository pattern for data access (packages/sushii-worker/src/db/)
- Database types auto-generated with kysely-codegen
- PostgreSQL with migrations in sushii-db package

### Bot Architecture (sushii-worker)
- Event-driven architecture with handlers in src/events/
- Slash commands and interactions in src/interactions/
- Background tasks for scheduled operations (src/tasks/)
- Metrics collection with Prometheus (src/metrics/)
- Modular design with repositories for each database entity

### API Layer (sushii-data)
- PostGraphile for auto-generated GraphQL API
- Express.js server with compression and security headers
- Redis integration for caching
- GraphQL schema extensions in src/extended_schema/

### Key Directories
- `src/interactions/` - Discord slash commands, buttons, modals
- `src/events/` - Discord event handlers (message, member join/leave, etc.)
- `src/db/` - Database repositories and table definitions
- `src/tasks/` - Background scheduled tasks
- `src/utils/` - Shared utility functions
- `src/metrics/` - Prometheus metrics collection

## Testing

The project uses different testing frameworks:
- `bun test` (built-in Bun test runner) for sushii-worker
- `jest` for sushii-data

Run tests with workspace-specific commands or use the root level `yarn test:worker`.

## Important Notes

- The bot uses Bun as the runtime for the worker service
- TypeScript configuration requires `--skipLibCheck` flag
- Development logging uses pino with pretty formatting
- Database schema changes require running kysely-codegen to update types