# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Discord bot called sushii, built with Discord.js and Bun. It's a TypeScript monorepo that migrated from Rust back to Discord.js for ease of use with Discord interactions.

## Workspace Structure

This is a bun workspaces monorepo with the following packages:

- `sushii-worker` - Main Discord bot application
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

# Generate database types from schema (Kysely legacy)
bun codegen:pg

# Code formatting
bun prettier

# Linting
bun lint

# Drizzle Kit commands (new ORM)
bunx drizzle-kit generate  # Generate migrations
bunx drizzle-kit migrate   # Run migrations 
bunx drizzle-kit studio    # Database browser
```

## Architecture

### Database Layer
- **Dual ORM Strategy**: Currently migrating from Kysely to Drizzle ORM
  - Kysely: Legacy type-safe SQL queries (packages/sushii-worker/src/db/)
  - Drizzle: New ORM with schema in src/db/schema.ts and drizzle.config.ts
- Repository pattern for data access with three PostgreSQL schemas: `app_public`, `app_private`, `app_hidden`
- Database types auto-generated with kysely-codegen (legacy) and Drizzle Kit (new)
- Migrations managed by Graphile Migrate (sushii-db package) and Drizzle Kit

### Bot Architecture (sushii-worker)
- **Core Files**: client.ts (interaction client), index.ts (entry point with sharding), shard.ts (individual shard logic)
- Event-driven architecture with handlers in src/events/
- Slash commands and interactions in src/interactions/ (commands, buttons, modals, autocomplete, context menus)
- Background tasks for scheduled operations (src/tasks/) using cron
- Metrics collection with Prometheus (src/metrics/) on port 9090
- Modular design with repositories for each database entity
- **Observability**: OpenTelemetry tracing, Sentry error tracking, structured logging with pino

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

Run tests with workspace-specific commands or use the root level `bun test:worker`.

## Important Notes

- The bot uses Bun as the runtime for the worker service
- TypeScript configuration requires `--skipLibCheck` flag
- Development logging uses pino with pretty formatting via `pino-pretty -c -t`
- **Database Migration Strategy**: Currently transitioning from Kysely to Drizzle ORM
  - Legacy: Database schema changes require running `bun codegen:pg` to update types
  - New: Use Drizzle Kit for schema management and migrations
- The bot supports Discord.js sharding for horizontal scaling
- Uses Docker for containerization with multi-stage builds
- Three-schema PostgreSQL design: app_public (user data), app_private (internal), app_hidden (background processing)

## Target Architecture (Migration in Progress)

**Status**: Currently migrating from the existing structure to Domain-Driven Design (DDD) with Clean Architecture principles.

### Architecture Overview

The target architecture follows a 4-layer Clean Architecture pattern with Domain-Driven Design:

```
Presentation → Application → Domain ← Infrastructure
    ↓              ↓           ↑           ↑
  Discord I/O   Use Cases   Business    External
  Commands      Orchestration  Logic    Adapters
```

### Example Directory Structure

```
src/
├── core/                          # Framework-agnostic bootstrapping
│   ├── config/                    # env loading, constants
│   ├── di/                        # dependency-injection container setup
│   ├── events/                    # event bus abstraction (publish/subscribe)
│   └── index.ts                   # application entry point
│
├── shared/                        # Cross-cutting utilities
│   ├── errors/                    # custom error types
│   ├── logger/                    # pino config
│   └── types/                     # global TS types/interfaces
│
├── infrastructure/                # External adapters & frameworks
│   ├── discord/                   # Discord.js client provider
│   ├── database/                  # DB client setup (e.g. Prisma, TypeORM)
│   └── analytics/                 # metrics, telemetry adapters
│
└── features/                      # Vertical slices (per feature)
    ├── moderation/
    │   ├── domain/                # business entities & repository interfaces
    │   │   ├── entities/
    │   │   └── repositories/
    │   │
    │   ├── application/           # use-cases / interactors
    │   │   └── banUserUseCase.ts
    │   │
    │   ├── infrastructure/        # concrete implementations
    │   │   ├── DiscordBanService.ts
    │   │   └── BanRepositoryPostgres.ts
    │   │
    │   └── presentation/          # Discord commands, event handlers, views
    │       ├── commands/
    │       ├── events/
    │       └── views/
    │
    ├── leveling/                  # same structure as moderation
    └── giveaways/                 # same structure as moderation
```

### Layer Responsibilities

#### 1. Domain Layer (Core Business Logic)
- **Location**: `src/features/{feature}/domain/`
- **Contains**: Entities, value objects, domain services, repository interfaces
- **Rules**: No external dependencies, pure TypeScript business logic
- **Examples**: `User.ts`, `BanPolicy.ts`, `Duration.ts`

#### 2. Application Layer (Use Case Orchestration)
- **Location**: `src/features/{feature}/application/`
- **Contains**: Use cases, application services, command/query handlers
- **Rules**: Orchestrates domain logic, calls infrastructure through interfaces
- **Examples**: `BanUserUseCase.ts`, `ModerationApplicationService.ts`

#### 3. Infrastructure Layer (External Adapters)
- **Location**: `src/features/{feature}/infrastructure/`
- **Contains**: Repository implementations, external service adapters, database models
- **Rules**: Implements domain interfaces, handles all external I/O
- **Examples**: `PostgresUserRepository.ts`, `DiscordApiService.ts`

#### 4. Presentation Layer (Input/Output Adapters)
- **Location**: `src/features/{feature}/presentation/`
- **Contains**: Discord commands, event handlers, views, DTOs, mappers
- **Rules**: Maps Discord interactions to application commands, formats responses
- **Examples**: `BanCommand.ts`, `BanSuccessView.ts`, `GuildBanAddHandler.ts`

### Bounded Contexts (Feature Organization)

Each feature represents a bounded context with its own ubiquitous language:

```
src/features/
├── moderation/          # User bans, warnings, moderation logs
├── leveling/            # XP system, level roles, leaderboards  
├── giveaways/           # Giveaway creation, entries, winner selection
├── notifications/       # User notifications, subscriptions
├── tags/                # Custom server tags and responses
└── roles/               # Role menus, auto-roles
```

### Shared Components

```
src/shared/
├── domain/              # Base classes (Entity, ValueObject, DomainEvent)
├── application/         # Common interfaces (UseCase, EventBus, UnitOfWork)
├── infrastructure/      # Shared adapters (DatabaseConnection, Logger)
└── presentation/        # Common utilities (BaseCommand, ErrorHandler)
```

### Dependency Rules

1. **Inward Dependencies Only**: All dependencies point toward the domain layer
2. **Interface Segregation**: Infrastructure implements domain interfaces
3. **No Framework Leakage**: Domain and Application layers are framework-agnostic
4. **Event-Driven Communication**: Features communicate through domain events

### Migration Strategy

#### Current Status
- ✅ Planning phase complete
- ⏳ Foundation infrastructure (in progress)
- ⏳ Single feature proof-of-concept (planned)
- ⏳ Core features migration (planned)
- ⏳ Remaining features migration (planned)

#### Migration Guidelines

**For New Features**: Implement using the full 4-layer architecture from the start.

**For Existing Features**: Migrate incrementally without breaking existing functionality:
1. Create new domain layer alongside existing code
2. Implement application layer use cases
3. Add infrastructure adapters
4. Create new presentation layer
5. Switch over and remove old implementation

#### Development Guidelines During Migration

**New Code**: Always follow the 4-layer architecture:
```typescript
// ✅ Good: New feature following DDD structure
src/features/polls/
├── domain/entities/Poll.ts
├── application/use-cases/CreatePollUseCase.ts
├── infrastructure/repositories/PostgresPollRepository.ts
└── presentation/commands/PollCommand.ts

// ❌ Avoid: Adding to old structure
src/interactions/polls/PollCommand.ts
```

**Existing Code**: When modifying existing features:
- Extract business logic to domain entities
- Move orchestration to application services
- Keep presentation layer thin (mapping only)
- Add tests for each layer

**Cross-Feature Communication**: Use domain events, not direct service calls:
```typescript
// ✅ Good: Event-driven communication
user.ban(reason, duration);
eventBus.publish(new UserBannedEvent(user.id));

// ❌ Avoid: Direct service coupling
await levelingService.resetUserXp(user.id);
```

### Testing Strategy

- **Domain Layer**: Pure unit tests, no mocks needed
- **Application Layer**: Use case tests with mocked dependencies
- **Infrastructure Layer**: Integration tests with real external services
- **Presentation Layer**: Command/event handler tests with mocked application services

### Benefits of This Architecture

1. **Testability**: Business logic can be tested without Discord.js or database
2. **Flexibility**: Can swap frameworks/databases without changing business logic
3. **Maintainability**: Clear separation of concerns and explicit dependencies
4. **Scalability**: Independent feature development and deployment
5. **Team Development**: Multiple developers can work on different bounded contexts