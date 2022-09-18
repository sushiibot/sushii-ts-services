import {
  GatewayDispatchEvents,
  GatewayGuildBanModifyDispatchData,
} from "discord-api-types/v10";
import logger from "../logger";
import Context from "../model/context";

export default class ModLogHandler {
  async handleEvent(
    ctx: Context,
    eventType: GatewayDispatchEvents,
    event: GatewayGuildBanModifyDispatchData
  ): Promise<void> {
    if (eventType !== GatewayDispatchEvents.GuildBanAdd) {
      return;
    }

    const { guildConfigById } = await ctx.sushiiAPI.sdk.guildConfigByID({
      guildId: event.guild_id,
    });

    // No guild config found, ignore
    if (
      !guildConfigById || // Config not found
      !guildConfigById.logMod || // No mod log set
      !guildConfigById.logModEnabled // Mod log disabled
    ) {
      return;
    }

    if (eventType === GatewayDispatchEvents.GuildBanAdd) {
      logger.info(event.user);
    }

    // TODO:
  }
}
