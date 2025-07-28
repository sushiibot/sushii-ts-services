import { Client } from "discord.js";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Logger } from "pino";

import * as schema from "@/infrastructure/database/schema";
import { SlashCommandHandler } from "@/interactions/handlers";
import { DrizzleGuildConfigRepository } from "@/shared/infrastructure/DrizzleGuildConfigRepository";

import {
  CaseDeletionService,
  DMPolicyService,
  HistoryService,
  LookupUserService,
  ModerationExecutionPipeline,
  ModerationService,
  SlowmodeService,
  TargetResolutionService,
  TempBanListService,
} from "./application";
import { TimeoutDetectionService } from "./domain/services/TimeoutDetectionService";
import {
  DiscordChannelService,
  DiscordModLogService,
  DiscordPermissionValidationService,
  DrizzleModerationCaseRepository,
  DrizzleTempBanRepository,
} from "./infrastructure";
import {
  COMMAND_CONFIGS,
  HistoryCommand,
  LookupCommand,
  ModerationCommand,
  SlowmodeCommand,
  TempbanListCommand,
  UncaseCommand,
} from "./presentation";

interface ModerationDependencies {
  db: NodePgDatabase<typeof schema>;
  client: Client;
  logger: Logger;
}

export function createModerationServices({
  db,
  client,
  logger,
}: ModerationDependencies) {
  const moderationCaseRepository = new DrizzleModerationCaseRepository(
    db,
    logger.child({ module: "moderationCaseRepository" }),
  );

  const guildConfigRepository = new DrizzleGuildConfigRepository(
    db,
    logger.child({ module: "guildConfigRepository" }),
  );

  const tempBanRepository = new DrizzleTempBanRepository(
    db,
    logger.child({ module: "tempBanRepository" }),
  );

  const dmPolicyService = new DMPolicyService(guildConfigRepository);

  const permissionService = new DiscordPermissionValidationService();
  const timeoutDetectionService = new TimeoutDetectionService();
  const modLogService = new DiscordModLogService(
    client,
    logger.child({ module: "modLogService" }),
  );

  // Create execution pipeline with focused dependencies
  const moderationExecutionPipeline = new ModerationExecutionPipeline(
    moderationCaseRepository,
    tempBanRepository,
    modLogService,
    dmPolicyService,
    client,
    logger.child({ module: "moderationExecutionPipeline" }),
  );

  const moderationService = new ModerationService(
    db,
    permissionService,
    timeoutDetectionService,
    moderationExecutionPipeline,
    logger.child({ module: "moderationService" }),
  );

  const lookupUserService = new LookupUserService(
    client,
    moderationCaseRepository,
    logger.child({ module: "lookupUserService" }),
  );

  const targetResolutionService = new TargetResolutionService();

  const historyService = new HistoryService(
    client,
    moderationCaseRepository,
    logger.child({ module: "historyService" }),
  );

  // New utility services
  const tempBanListService = new TempBanListService(
    tempBanRepository,
    logger.child({ module: "tempBanListService" }),
  );

  const channelService = new DiscordChannelService(
    client,
    logger.child({ module: "channelService" }),
  );

  const slowmodeService = new SlowmodeService(
    channelService,
    logger.child({ module: "slowmodeService" }),
  );

  const caseDeletionService = new CaseDeletionService(
    db,
    moderationCaseRepository,
    guildConfigRepository,
    client,
    logger.child({ module: "caseDeletionService" }),
  );

  return {
    moderationCaseRepository,
    guildConfigRepository,
    tempBanRepository,
    dmPolicyService,
    moderationService,
    lookupUserService,
    targetResolutionService,
    historyService,
    tempBanListService,
    channelService,
    slowmodeService,
    caseDeletionService,
  };
}

export function createModerationCommands(
  services: ReturnType<typeof createModerationServices>,
  logger: Logger,
) {
  const {
    moderationService,
    lookupUserService,
    targetResolutionService,
    historyService,
    tempBanListService,
    slowmodeService,
    caseDeletionService,
  } = services;

  // Iterate over all COMMAND_CONFIGS and build commands
  const commands: SlashCommandHandler[] = Object.values(COMMAND_CONFIGS).map(
    (config) => {
      return new ModerationCommand(
        config,
        moderationService,
        targetResolutionService,
        logger.child({ commandHandler: config.actionType }),
      );
    },
  );

  commands.push(
    new LookupCommand(
      lookupUserService,
      logger.child({ commandHandler: "lookup" }),
    ),
    new HistoryCommand(
      historyService,
      logger.child({ commandHandler: "history" }),
    ),
    // Utility commands
    new TempbanListCommand(
      tempBanListService,
      logger.child({ commandHandler: "tempban-list" }),
    ),
    new SlowmodeCommand(
      slowmodeService,
      logger.child({ commandHandler: "slowmode" }),
    ),
    new UncaseCommand(
      caseDeletionService,
      logger.child({ commandHandler: "uncase" }),
    ),
  );

  return {
    commands,
    autocompletes: [],
  };
}

export function createModerationEventHandlers(
  services: ReturnType<typeof createModerationServices>,
  logger: Logger,
) {
  // Moderation feature doesn't have event handlers currently
  return {
    eventHandlers: [],
  };
}

export function setupModerationFeature({
  db,
  client,
  logger,
}: ModerationDependencies) {
  const services = createModerationServices({ db, client, logger });
  const commands = createModerationCommands(services, logger);
  const events = createModerationEventHandlers(services, logger);

  return {
    services,
    ...commands,
    ...events,
  };
}
