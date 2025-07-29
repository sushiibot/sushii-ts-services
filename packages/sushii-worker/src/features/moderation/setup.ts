import { Client } from "discord.js";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Logger } from "pino";

import * as schema from "@/infrastructure/database/schema";
import { SlashCommandHandler } from "@/interactions/handlers";
import { DrizzleGuildConfigRepository } from "@/shared/infrastructure/DrizzleGuildConfigRepository";

// Actions sub-feature
import {
  DMPolicyService,
  ModerationExecutionPipeline,
  ModerationService,
  TargetResolutionService,
} from "./actions/application";
// Shared components
import { DMNotificationService } from "./shared/application";
import { ModerationCommand } from "./actions/presentation";
// Audit logs sub-feature
import {
  AuditLogProcessingService,
  NativeTimeoutDMService,
  ModLogPostingService,
  AuditLogOrchestrationService,
} from "./audit-logs/application";
import { DiscordAuditLogService } from "./audit-logs/infrastructure";
import { createAuditLogEventHandler } from "./audit-logs/presentation";
// Cases sub-feature
import {
  CaseDeletionService,
  CaseRangeAutocompleteService,
  LookupUserService,
  ReasonUpdateService,
} from "./cases/application";
import {
  HistoryCommand,
  LookupCommand,
  LookupContextMenuHandler,
  ReasonCommand,
  UncaseCommand,
} from "./cases/presentation";
// Management sub-feature
import { PruneMessageService, SlowmodeService, TempBanListService } from "./management/application";
import { PruneCommand, SlowmodeCommand, TempbanListCommand } from "./management/presentation";
// Shared components
import { TimeoutDetectionService } from "./shared/domain/services/TimeoutDetectionService";
import {
  DiscordChannelService,
  DiscordModLogService,
  DiscordPermissionValidationService,
  DrizzleModerationCaseRepository,
  DrizzleModLogRepository,
  DrizzleTempBanRepository,
} from "./shared/infrastructure";
import { COMMAND_CONFIGS, ReasonAutocomplete } from "./shared/presentation";

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

  const modLogRepository = new DrizzleModLogRepository(
    db,
    logger.child({ module: "modLogRepository" }),
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
  const dmNotificationService = new DMNotificationService(
    logger.child({ module: "dmNotificationService" }),
  );

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
    dmNotificationService,
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

  const pruneMessageService = new PruneMessageService(
    client,
    logger.child({ module: "pruneMessageService" }),
  );

  const caseDeletionService = new CaseDeletionService(
    db,
    moderationCaseRepository,
    guildConfigRepository,
    client,
    logger.child({ module: "caseDeletionService" }),
  );

  const reasonUpdateService = new ReasonUpdateService(
    moderationCaseRepository,
    guildConfigRepository,
    client,
    logger.child({ module: "reasonUpdateService" }),
  );

  const caseRangeAutocompleteService = new CaseRangeAutocompleteService(
    moderationCaseRepository,
    logger.child({ module: "caseRangeAutocompleteService" }),
  );

  // Audit log services
  const auditLogProcessingService = new AuditLogProcessingService(
    modLogRepository,
    guildConfigRepository,
    logger.child({ module: "auditLogProcessingService" }),
  );

  const nativeTimeoutDMService = new NativeTimeoutDMService(
    dmNotificationService,
    logger.child({ module: "nativeTimeoutDMService" }),
  );

  const modLogPostingService = new ModLogPostingService(
    logger.child({ module: "modLogPostingService" }),
  );

  const auditLogOrchestrationService = new AuditLogOrchestrationService(
    auditLogProcessingService,
    nativeTimeoutDMService,
    modLogPostingService,
    guildConfigRepository,
    logger.child({ module: "auditLogOrchestrationService" }),
  );

  const discordAuditLogService = new DiscordAuditLogService(
    auditLogOrchestrationService,
    logger.child({ module: "discordAuditLogService" }),
  );

  return {
    moderationCaseRepository,
    modLogRepository,
    guildConfigRepository,
    tempBanRepository,
    dmPolicyService,
    dmNotificationService,
    moderationService,
    lookupUserService,
    targetResolutionService,
    tempBanListService,
    channelService,
    slowmodeService,
    pruneMessageService,
    caseDeletionService,
    reasonUpdateService,
    caseRangeAutocompleteService,
    // Audit log services
    auditLogProcessingService,
    nativeTimeoutDMService,
    modLogPostingService,
    auditLogOrchestrationService,
    discordAuditLogService,
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
    tempBanListService,
    slowmodeService,
    pruneMessageService,
    caseDeletionService,
    reasonUpdateService,
    caseRangeAutocompleteService,
  } = services;

  // Iterate over all COMMAND_CONFIGS and build commands
  const commands: SlashCommandHandler[] = Object.values(COMMAND_CONFIGS).map(
    (config) => {
      return new ModerationCommand(
        config,
        moderationService,
        targetResolutionService,
      );
    },
  );

  commands.push(
    new LookupCommand(
      lookupUserService,
      logger.child({ commandHandler: "lookup" }),
    ),
    new HistoryCommand(
      lookupUserService,
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
    new PruneCommand(
      pruneMessageService,
      logger.child({ commandHandler: "prune" }),
    ),
    new UncaseCommand(
      caseDeletionService,
      logger.child({ commandHandler: "uncase" }),
    ),
    new ReasonCommand(
      reasonUpdateService,
      logger.child({ commandHandler: "reason" }),
    ),
  );

  const autocompletes = [
    new ReasonAutocomplete(
      caseRangeAutocompleteService,
      logger.child({ autocompleteHandler: "reason" }),
    ),
  ];

  const contextMenuHandlers = [
    new LookupContextMenuHandler(
      lookupUserService,
      logger.child({ contextMenuHandler: "lookupContextMenu" }),
    ),
  ];

  return {
    commands,
    autocompletes,
    contextMenuHandlers,
  };
}

export function createModerationEventHandlers(
  services: ReturnType<typeof createModerationServices>,
  logger: Logger,
) {
  const { discordAuditLogService } = services;

  const auditLogEventHandler = createAuditLogEventHandler(
    discordAuditLogService,
    logger.child({ eventHandler: "auditLog" }),
  );

  return {
    eventHandlers: {
      auditLog: auditLogEventHandler,
    },
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
