import { Events, Message } from "discord.js";
import logger from "../logger";
import Context from "../model/context";
import EventHandler from "./EventHandler";

export default class LevelHandler
  implements EventHandler<Events.MessageCreate>
{
  async handler(ctx: Context, msg: Message): Promise<void> {
    // Ignore dms
    if (!msg.inGuild()) {
      return;
    }

    // Ignore bots
    if (msg.author.bot) {
      return;
    }

    if (!msg.member) {
      // This shouldn't happen as member should exist in message create events.
      logger.warn(msg, "No member found for message");
      return;
    }

    const { updateUserXp } = await ctx.sushiiAPI.sdk.updateUserXp({
      guildId: msg.guildId,
      userId: msg.author.id,
      channelId: msg.channelId,
      roleIds: msg.member?.roles.cache.map((r) => r.id) || [],
    });

    const updateRes = updateUserXp?.userXpUpdateResult;
    if (!updateRes || !updateRes.newLevel || !updateRes.oldLevel) {
      // No xp updates, e.g. already sent message within past 1 minute
      return;
    }

    if (!updateRes.addRoleIds && !updateRes.removeRoleIds) {
      return;
    }

    // If no roles to add or remove
    if (
      updateRes.addRoleIds &&
      updateRes.addRoleIds.length === 0 &&
      updateRes.removeRoleIds &&
      updateRes.removeRoleIds.length === 0
    ) {
      return;
    }

    // New roles to assign to the member, including their current ones
    const newRoles = new Set(msg.member.roles.cache.keys() || []);

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
    //
    // Need to ensure the size matches, as if there are added roles, the second
    // part of the every() check will still be true.
    const noRoleChanges =
      newRoles.size === msg.member.roles.cache.size &&
      msg.member.roles.cache.every((r) => newRoles.has(r.id));
    if (noRoleChanges) {
      return;
    }

    await ctx.REST.setMemberRoles(
      msg.guildId,
      msg.author.id,
      [...newRoles],
      `Level role ${updateRes.newLevel}`
    );

    logger.debug(
      {
        guildId: msg.guildId,
        channelId: msg.channelId,
        userId: msg.author.id,
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
