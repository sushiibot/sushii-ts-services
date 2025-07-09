import { UpdateUserXpService } from "@/features/leveling/application/UpdateUserXpService";
import { LevelRoleRepositoryImpl } from "@/features/leveling/infrastructure/LevelRoleRepositoryImpl";
import { UserLevelRepositoryImpl } from "@/features/leveling/infrastructure/UserLevelRepositoryImpl";
import { XpBlockRepositoryImpl } from "@/features/leveling/infrastructure/XpBlockRepositoryImpl";
import { MessageLevelHandler } from "@/features/leveling/presentation/MessageLevelHandler";
import { drizzleDb } from "@/infrastructure/database/db";
import { DeploymentService } from "@/features/deployment/application/DeploymentService";
import { PostgreSQLDeploymentRepository } from "@/features/deployment/infrastructure/PostgreSQLDeploymentRepository";
import { DeploymentEventHandler } from "@/features/deployment/presentation/DeploymentEventHandler";
import { SimpleEventBus } from "@/shared/infrastructure/SimpleEventBus";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Client } from "discord.js";
import { EventHandler } from "./presentation/EventHandler";
import { config } from "@/shared/infrastructure/config";
import { DeploymentChanged } from "@/features/deployment/domain/events/DeploymentChanged";
import logger from "@/shared/infrastructure/logger";
import { ProcessLegacyCommandService } from "@/features/deprecation/application/ProcessLegacyCommandService";
import { InMemoryDeprecationWarningRepository } from "@/features/deprecation/infrastructure/InMemoryDeprecationWarningRepository";
import { DiscordNotificationService } from "@/features/deprecation/infrastructure/DiscordNotificationService";
import { LegacyCommandDeprecationHandler } from "@/features/deprecation/presentation/LegacyCommandDeprecationHandler";
import { BotResponseHandler } from "@/features/deprecation/presentation/BotResponseHandler";
import { DrizzleGuildConfigRepository } from "@/features/deprecation/infrastructure/DrizzleGuildConfigRepository";
import { InMemoryCommandTracker } from "@/features/deprecation/infrastructure/InMemoryCommandTracker";

export async function initCore() {
  // This just returns the global existing database for now, until we fully
  // integrate the database into the core
  const db = drizzleDb;

  // Create shared infrastructure
  const eventBus = new SimpleEventBus();

  // Initialize deployment service with direct database connection
  const deploymentRepository = new PostgreSQLDeploymentRepository(
    config.database.url,
    logger,
    eventBus,
    `sushii-deployment-${config.deployment.name}-shard-${process.env.SHARD_ID || "unknown"}`,
  );

  const deploymentService = new DeploymentService(
    deploymentRepository,
    logger,
    config.deployment.name,
  );

  // Subscribe to deployment changes
  eventBus.subscribe(DeploymentChanged, (event) => {
    deploymentService.handleDeploymentChanged(event);
  });

  await deploymentService.start();

  return {
    db,
    deploymentService,
    eventBus,
  };
}

export function registerFeatures(
  db: NodePgDatabase,
  client: Client,
  deploymentService: DeploymentService,
): void {
  // ---------------------------------------------------------------------------
  // Feature bootstrapping
  const levelService = new UpdateUserXpService(
    new UserLevelRepositoryImpl(db),
    new LevelRoleRepositoryImpl(db),
    new XpBlockRepositoryImpl(db),
  );

  const commandTracker = new InMemoryCommandTracker();
  
  const deprecationService = new ProcessLegacyCommandService(
    new InMemoryDeprecationWarningRepository(),
    new DrizzleGuildConfigRepository(db),
    commandTracker,
    new DiscordNotificationService(client, logger),
  );

  const botUserId = client.user?.id;
  if (!botUserId) {
    throw new Error("Bot user ID not available during bootstrap");
  }

  const levelHandler = new MessageLevelHandler(levelService);
  const deploymentHandler = new DeploymentEventHandler(
    deploymentService,
    logger,
  );
  const deprecationHandler = new LegacyCommandDeprecationHandler(
    deprecationService,
    logger,
  );
  const botResponseHandler = new BotResponseHandler(
    deprecationService,
    logger,
    botUserId,
  );

  const handlers = [levelHandler, deploymentHandler, deprecationHandler, botResponseHandler];

  // ---------------------------------------------------------------------------
  // Register event handlers

  // Union type is too much for typescript, so we just use any here - it's
  // already type enforced in implementation, and the usage is fine
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlerGroups = new Map<string, EventHandler<any>[]>();

  // Group handlers by event type
  for (const handler of handlers) {
    const eventType = handler.eventType;

    if (!handlerGroups.has(eventType)) {
      handlerGroups.set(eventType, []);
    }

    const group = handlerGroups.get(eventType);
    if (group) {
      group.push(handler);
    }
  }

  // Build event listeners
  for (const [eventType, group] of handlerGroups.entries()) {
    logger.info(
      {
        eventType,
        handlerNames: group.map((h) => h.constructor.name),
        count: group.length,
      },
      `Registering event handler for ${eventType}`,
    );

    client.on(eventType, async (...args) => {
      try {
        const promises = [];

        for (const handler of group) {
          // TODO: Add trace span here
          const p = handler.handle(...args);
          promises.push(p);
        }
        // Run all handlers concurrently and wait for all to settle
        const results = await Promise.allSettled(promises);

        // Log any errors that occurred in the handlers
        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          if (result.status === "rejected") {
            logger.error(
              {
                error: result.reason,
                eventType,
                handler: group[i].constructor.name,
              },
              `Error in handler for event ${eventType}`,
            );
          }
        }
      } catch (error) {
        logger.error(
          {
            error,
            eventType,
            handlers: group.map((h) => h.constructor.name),
          },
          `Error handling event ${eventType}`,
        );
      }
    });
  }
}
