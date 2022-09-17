import {
  GatewayDispatchEvents,
  GatewayMessageCreateDispatchData,
} from "discord-api-types/v10";
import logger from "../logger";
import Context from "../model/context";
import EventHandler from "./EventHandler";

export default class LevelHandler implements EventHandler {
  eventTypes = [GatewayDispatchEvents.MessageCreate];

  async handler(
    ctx: Context,
    _: GatewayDispatchEvents,
    event: GatewayMessageCreateDispatchData
  ): Promise<void> {
    // Ignore dms
    if (!event.guild_id) {
      return;
    }

    // Ignore bots
    if (event.author.bot) {
      return;
    }

    const { updateUserXp } = await ctx.sushiiAPI.sdk.updateUserXp({
      guildId: event.guild_id,
      userId: event.author.id,
      channelId: event.channel_id,
      roleIds: event.member?.roles || [],
    });

    const updateRes = updateUserXp?.userXpUpdateResult;
    if (!updateRes || !updateRes.newLevel || !updateRes.oldLevel) {
      // No xp updates, e.g. already sent message within past 1 minute
      return;
    }

    // New roles to assign to the member, including their current ones
    const newRoles = new Set(event.member?.roles || []);

    if (updateRes.addRoleIds) {
      const addRoles = updateRes.addRoleIds.filter((r): r is string => !!r);

      for (const roleId of addRoles) {
        newRoles.add(roleId);
      }
    }

    if (updateRes.removeRoleIds) {
      const removeRoles = updateRes.removeRoleIds.filter(
        (r): r is string => !!r
      );

      for (const roleId of removeRoles) {
        newRoles.delete(roleId);
      }
    }

    logger.debug(
      {
        guildId: event.guild_id,
        channelId: event.channel_id,
        userId: event.author.id,
        newLevel: updateRes.newLevel,
        addRoleIds: updateRes.addRoleIds,
        removeRoleIds: updateRes.removeRoleIds,
        newMemberRoles: newRoles,
      },
      "Level role update"
    );

    await ctx.REST.setMemberRoles(
      event.guild_id,
      event.author.id,
      [...newRoles],
      `Level role ${updateRes.newLevel}`
    );
  }
}
