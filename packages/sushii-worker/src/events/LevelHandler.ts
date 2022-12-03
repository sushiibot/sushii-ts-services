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

    if (!event.member) {
      // This shouldn't happen as member should exist in message create events.
      logger.warn(event, "No member found for message");
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

    // Do not do any api requests if there are no role changes, e.g. user already
    // has all eligible level roles.
    //
    // This is going to be the most common case. As the sushii API will always
    // return all level roles the user should have, instead of only when the
    // user levels up.
    const noRoleChanges = event.member?.roles.every((r) => newRoles.has(r));
    if (noRoleChanges) {
      return;
    }

    if (
      (updateRes.addRoleIds && updateRes.addRoleIds.length > 0) ||
      (updateRes.removeRoleIds && updateRes.removeRoleIds.length > 0)
    ) {
      await ctx.REST.setMemberRoles(
        event.guild_id,
        event.author.id,
        [...newRoles],
        `Level role ${updateRes.newLevel}`
      );

      logger.debug(
        {
          guildId: event.guild_id,
          channelId: event.channel_id,
          userId: event.author.id,
          oldLevel: updateRes.oldLevel,
          newLevel: updateRes.newLevel,
          addRoleIds: updateRes.addRoleIds,
          removeRoleIds: updateRes.removeRoleIds,
          newMemberRoles: [...newRoles],
        },
        "Level role update"
      );
    }
  }
}
