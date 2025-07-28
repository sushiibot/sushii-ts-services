import { Client } from "discord.js";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Logger } from "pino";

import * as schema from "@/infrastructure/database/schema";
import { SlashCommandHandler } from "@/interactions/handlers";
import { DrizzleGuildConfigRepository } from "@/shared/infrastructure/DrizzleGuildConfigRepository";

import {
  DMPolicyService,
  LookupUserService,
  ModerationExecutionPipeline,
  ModerationService,
  TargetResolutionService,
} from "./application";
import { TimeoutDetectionService } from "./domain/services/TimeoutDetectionService";
import {
  DiscordModLogService,
  DiscordPermissionValidationService,
  DrizzleModerationCaseRepository,
  DrizzleTempBanRepository,
} from "./infrastructure";
import {
  COMMAND_CONFIGS,
  LookupCommand,
  ModerationCommand,
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

  return {
    moderationCaseRepository,
    guildConfigRepository,
    tempBanRepository,
    dmPolicyService,
    moderationService,
    lookupUserService,
    targetResolutionService,
  };
}

export function createModerationCommands(
  services: ReturnType<typeof createModerationServices>,
  logger: Logger,
) {
  const { moderationService, lookupUserService, targetResolutionService } =
    services;

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
