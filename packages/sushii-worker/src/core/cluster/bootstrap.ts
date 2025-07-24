import { UpdateUserXpService } from "@/features/leveling/application/UpdateUserXpService";
import { LevelRoleRepositoryImpl } from "@/features/leveling/infrastructure/LevelRoleRepositoryImpl";
import { XpBlockRepositoryImpl } from "@/features/leveling/infrastructure/XpBlockRepositoryImpl";
import { MessageLevelHandler } from "@/features/leveling/presentation/commands/MessageLevelHandler";
import { GetUserRankService } from "@/features/leveling/application/GetUserRankService";
import { UserProfileRepository } from "@/features/leveling/infrastructure/UserProfileRepository";
import RankCommand from "@/features/leveling/presentation/commands/RankCommand";
import { drizzleDb } from "@/infrastructure/database/db";
import { DeploymentService } from "@/features/deployment/application/DeploymentService";
import { PostgreSQLDeploymentRepository } from "@/features/deployment/infrastructure/PostgreSQLDeploymentRepository";
import { DeploymentEventHandler } from "@/features/deployment/presentation/DeploymentEventHandler";
import { SimpleEventBus } from "@/shared/infrastructure/SimpleEventBus";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Client } from "discord.js";
import { EventHandler } from "./presentation/EventHandler";
import InteractionRouter from "./discord/InteractionRouter";
import { config } from "@/shared/infrastructure/config";
import { DeploymentChanged } from "@/features/deployment/domain/events/DeploymentChanged";
import * as schema from "@/infrastructure/database/schema";
import logger from "@/shared/infrastructure/logger";
import { UserLevelRepository } from "@/features/leveling/infrastructure/UserLevelRepository";
import {
  TagService,
  TagSearchService,
  TagAdminService,
} from "@/features/tags/application";
import { DrizzleTagRepository } from "@/features/tags/infrastructure";
import {
  TagInfoCommand,
  TagAddCommand,
  TagGetCommand,
  TagEditCommand,
  TagAdminCommand,
  TagAutocomplete,
  TagGetAutocomplete,
  TagEditInteractionHandler,
} from "@/features/tags/presentation";
import { NotificationService } from "@/features/notifications/application/NotificationService";
import { NotificationMessageService } from "@/features/notifications/application/NotificationMessageService";
import { DrizzleNotificationRepository } from "@/features/notifications/infrastructure/DrizzleNotificationRepository";
import { DrizzleNotificationBlockRepository } from "@/features/notifications/infrastructure/DrizzleNotificationBlockRepository";
import { NotificationCommand } from "@/features/notifications/presentation/commands/NotificationCommand";
import { NotificationAutocomplete } from "@/features/notifications/presentation/autocompletes/NotificationAutocomplete";
import { NotificationMessageHandler } from "@/features/notifications/presentation/events/NotificationMessageHandler";
import { GuildSettingsService } from "@/features/guild-settings/application/GuildSettingsService";
import { MessageLogService } from "@/features/guild-settings/application/MessageLogService";
import { DrizzleGuildConfigurationRepository } from "@/features/guild-settings/infrastructure/DrizzleGuildConfigurationRepository";
import { DrizzleMessageLogBlockRepository } from "@/features/guild-settings/infrastructure/DrizzleMessageLogBlockRepository";
import SettingsCommand from "@/features/guild-settings/presentation/commands/SettingsCommand";

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
    config.deployment,
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
  db: NodePgDatabase<typeof schema>,
  client: Client,
  deploymentService: DeploymentService,
  interactionRouter: InteractionRouter,
) {
  // --------------------------------------------------------------------------
  // Build commands

  // Leveling feature
  const userProfileRepository = new UserProfileRepository(db);
  const userLevelRepository = new UserLevelRepository(db);

  const getUserRankService = new GetUserRankService(
    userProfileRepository,
    userLevelRepository,
  );

  const rankCommand = new RankCommand(
    getUserRankService,
    logger.child({ module: "rank" }),
  );

  // Tags feature
  const tagRepository = new DrizzleTagRepository(
    db,
    logger.child({ module: "tags" }),
  );
  const tagService = new TagService(
    tagRepository,
    logger.child({ module: "tagService" }),
  );
  const tagSearchService = new TagSearchService(
    tagRepository,
    logger.child({ module: "tagSearchService" }),
  );
  const tagAdminService = new TagAdminService(
    tagRepository,
    logger.child({ module: "tagAdminService" }),
  );

  const tagEditInteractionHandler = new TagEditInteractionHandler(
    tagService,
    logger.child({ module: "tagEditInteractionHandler" }),
  );

  const tagInfoCommand = new TagInfoCommand(
    tagService,
    tagSearchService,
    logger.child({ module: "tagInfoCommand" }),
  );

  const tagEditCommand = new TagEditCommand(
    tagService,
    tagEditInteractionHandler,
    logger.child({ module: "tagEditCommand" }),
  );
  const tagAddCommand = new TagAddCommand(
    tagService,
    logger.child({ module: "tagAddCommand" }),
  );
  const tagGetCommand = new TagGetCommand(
    tagService,
    logger.child({ module: "tagGetCommand" }),
  );

  const tagAdminCommand = new TagAdminCommand(
    tagAdminService,
    logger.child({ module: "tagAdminCommand" }),
  );

  const tagAutocomplete = new TagAutocomplete(
    tagSearchService,
    logger.child({ module: "tagAutocomplete" }),
  );
  const tagGetAutocomplete = new TagGetAutocomplete(
    tagSearchService,
    logger.child({ module: "tagGetAutocomplete" }),
  );

  // Notification feature
  const notificationRepository = new DrizzleNotificationRepository(db as any);
  const notificationBlockRepository = new DrizzleNotificationBlockRepository(
    db as any,
  );
  const notificationService = new NotificationService(
    notificationRepository,
    notificationBlockRepository,
    logger.child({ module: "notificationService" }),
  );
  const notificationMessageService = new NotificationMessageService(
    notificationService,
    logger.child({ module: "notificationMessageService" }),
  );

  const notificationCommand = new NotificationCommand(notificationService);
  const notificationAutocomplete = new NotificationAutocomplete(
    notificationService,
  );

  // Guild settings feature
  const guildConfigurationRepository = new DrizzleGuildConfigurationRepository(
    db,
    logger.child({ module: "guildConfigurationRepository" }),
  );
  const messageLogBlockRepository = new DrizzleMessageLogBlockRepository(
    db,
    logger.child({ module: "messageLogBlockRepository" }),
  );
  const guildSettingsService = new GuildSettingsService(
    guildConfigurationRepository,
    logger.child({ module: "guildSettingsService" }),
  );
  const messageLogService = new MessageLogService(
    messageLogBlockRepository,
    logger.child({ module: "messageLogService" }),
  );

  const settingsCommand = new SettingsCommand(
    guildSettingsService,
    messageLogService,
    logger.child({ module: "settingsCommand" }),
  );

  // Register commands and handlers on interaction router
  interactionRouter.addCommands(
    rankCommand,
    tagInfoCommand,
    tagAddCommand,
    tagGetCommand,
    tagEditCommand,
    tagAdminCommand,
    notificationCommand,
    settingsCommand,
  );
  interactionRouter.addAutocompleteHandlers(
    tagAutocomplete,
    tagGetAutocomplete,
    notificationAutocomplete,
  );

  // ---------------------------------------------------------------------------
  // Build event handlers

  // Leveling handler
  const levelService = new UpdateUserXpService(
    userLevelRepository,
    new LevelRoleRepositoryImpl(db),
    new XpBlockRepositoryImpl(db),
  );
  const levelHandler = new MessageLevelHandler(levelService);

  // Deployment handler
  const deploymentHandler = new DeploymentEventHandler(
    deploymentService,
    logger,
  );

  // Notification handler
  const notificationMessageHandler = new NotificationMessageHandler(
    notificationMessageService,
    notificationService,
  );

  const handlers = [
    levelHandler,
    deploymentHandler,
    notificationMessageHandler,
  ];

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
        // Check if deployment is active
        if (!deploymentService.isCurrentDeploymentActive()) {
          return;
        }

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
