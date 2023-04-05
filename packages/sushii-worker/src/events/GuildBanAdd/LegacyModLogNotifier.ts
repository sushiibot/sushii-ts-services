import { Events, GuildBan } from "discord.js";
import logger from "../../logger";
import Context from "../../model/context";
import { EventHandlerFn } from "../EventHandler";

const legacyModLogNotifierHandler: EventHandlerFn<Events.GuildBanAdd> = async (
  ctx: Context,
  ban: GuildBan
): Promise<void> => {
  // Ban event
  // Ban event, exit if already sent notification
  if (notifiedCache.has(guild.id)) {
    logger.debug(
      { guildId: guild.id },
      "Already notified guild of missing audit log perms"
    );
    return;
  }

  // Let's check if sushii has audit log perms in this guild.
  // Only fetch guild if not cached
  const guild = await ctx.REST.getGuild(guild.id);

  if (guild.err) {
    logger.error({ err: guild.err }, "Failed to get guild for ban event");
    return;
  }

  if (guild.ok && guild.val.permissions) {
    // sushii doesn't have audit log perms, notify
    if (
      !hasPermission(guild.val.permissions, PermissionFlagsBits.ViewAuditLog)
    ) {
      // Guild doesn't have audit log perms, notify
      const embed = new EmbedBuilder()
        .setTitle("Missing audit log permissions")
        .setDescription(
          "sushii now needs extra permissions to log mod actions, please make sure my role has the `View Audit Log` permission!"
        )
        .setColor(Color.Error);

      await ctx.REST.sendChannelMessage(guildConfigById.logMod, {
        embeds: [embed.toJSON()],
      });

      // Prevent logging again in this guild
      notifiedCache.add(guild.id);

      logger.debug(
        { guildId: guild.id },
        "Notified guild of missing audit log perms (ban event)"
      );
    }
  }
};

export default legacyModLogNotifierHandler;
