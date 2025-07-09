import dayjs from "@/shared/domain/dayjs";
import { Client } from "discord.js";
import { getAndDeleteExpiredTempBans } from "../db/TempBan/TempBan.repository";
import db from "../infrastructure/database/db";
import { newModuleLogger } from "@/shared/infrastructure/logger";
import toTimestamp from "../utils/toTimestamp";
import { AbstractBackgroundTask } from "./AbstractBackgroundTask";
import { DeploymentService } from "@/features/deployment/application/DeploymentService";

export class TempbanTask extends AbstractBackgroundTask {
  readonly name = "Unban expired tempbans";
  readonly cronTime = "*/30 * * * * *"; // Every 30 seconds

  constructor(client: Client, deploymentService: DeploymentService) {
    super(client, deploymentService, newModuleLogger("TempbansTask"));
  }

  protected async execute(): Promise<void> {
    const tempBans = await getAndDeleteExpiredTempBans(db);

    this.logger.debug(
      {
        tempBans: tempBans.length,
      },
      "Unbanning tempbans",
    );

    for (const tempBan of tempBans) {
      const guild = this.client.guilds.cache.get(tempBan.guild_id);
      if (!guild) {
        // Might be a guild that the bot is no longer in
        continue;
      }

      const ts = toTimestamp(dayjs.utc(tempBan.created_at));

      try {
        await guild.members.unban(
          tempBan.user_id,
          `Tempban from ${ts} expired.`,
        );
      } catch {
        // Ignore any errors -- either no perms or user was manually unbanned, etc
        continue;
      }
    }
  }
}
