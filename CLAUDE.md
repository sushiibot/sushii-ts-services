# CLAUDE.md

Discord bot (sushii) built with Discord.js, Bun, TypeScript monorepo. Migrating from Kysely to Drizzle ORM and from legacy structure to Clean Architecture with DDD.

## Commands

**Root**: `bun dev` | `bun test:worker`
**Worker**: `bun dev` | `bun test` | `bun typecheck` | `bun lint` | `bun prettier` | `bun codegen:pg` (legacy) | `bunx drizzle-kit generate/migrate/studio` (new)

## Architecture

**Current (Legacy)**: `src/interactions/`, `src/events/`, `src/db/`, `src/tasks/`, `src/metrics/`
**Target (Clean)**: 4-layer DDD with `src/core/`, `src/shared/`, `src/infrastructure/`, `src/features/{feature}/{domain,application,infrastructure,presentation}/`

**Database**: PostgreSQL with 3 schemas (app_public, app_private, app_hidden). Migrating Kysely → Drizzle.
**Core**: client.ts, index.ts (sharding), shard.ts. Prometheus metrics :9090, pino logging.

## Migration Guidelines

**New Code**: Use 4-layer architecture in `src/features/{feature}/`
**Existing**: Incremental migration without breaking functionality
**Communication**: Domain events, not direct service calls

## Key Practices

**DI**: Explicit constructor injection in bootstrap. Factory functions OK for feature setup (e.g. `createModerationServices()`), avoid for hiding single service dependencies
**Logging**: Use pino directly, `logger.info({context}, 'message')`, `err` field for errors  
**Imports**: Absolute (`@/`) for cross-feature/shared, relative for within-feature
**Sleep**: Use built-in `sleep` from "bun"

## Layer Structure & Rules

**Domain** (`/domain/`): Pure business logic, entities, interfaces. No external dependencies.
**Application** (`/application/`): Service orchestration, calls infrastructure via interfaces.
**Infrastructure** (`/infrastructure/`): Repository implementations, external adapters.
**Presentation** (`/presentation/`): Discord commands, event handlers, DTOs.

**Features**: moderation, leveling, giveaways, notifications, tags, roles

**Dependencies**: Point inward to domain. Use events between features, not direct calls.
**Testing**: Domain (unit), Application (mocked deps), Infrastructure (integration), Presentation (mocked services).