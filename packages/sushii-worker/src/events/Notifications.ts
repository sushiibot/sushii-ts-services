import {
  DiscordAPIError,
  EmbedBuilder,
  Events,
  Message,
  PermissionFlagsBits,
  RESTJSONErrorCodes,
} from "discord.js";
import opentelemetry from "@opentelemetry/api";
import { EventHandlerFn } from "./EventHandler";
import Context from "../model/context";
import {
  deleteNotification,
  getMatchingNotifications,
} from "../db/Notification/Notification.repository";
import db from "../model/db";
import Color from "../utils/colors";
import SushiiEmoji from "../constants/SushiiEmoji";
import { quoteMarkdownString } from "../utils/markdown";
import { getUserString } from "../utils/userString";
import { newModuleLogger } from "../logger";

const log = newModuleLogger("NotificationsHandler");

const tracer = opentelemetry.trace.getTracer("notification-handler");

export const notificationHandler: EventHandlerFn<Events.MessageCreate> = async (
  ctx: Context,
  msg: Message,
): Promise<void> => {
  // Ignore dms
  if (!msg.inGuild()) {
    return;
  }

  // Ignore bots
  if (msg.author.bot) {
    return;
  }

  // Empty message, either attachment or sticker only
  if (!msg.content) {
    return;
  }

  await tracer.startActiveSpan("notificationHandler", async (span) => {
    try {
      const matched = await getMatchingNotifications(
        db,
        msg.guildId,
        msg.author.id,
        msg.content,
      );

      if (!matched.length) {
        return;
      }

      // Deduplicate notifications by user_id
      const userIds = new Set<string>();
      const uniqueNotifications = matched.filter((n) => {
        if (userIds.has(n.user_id)) {
          return false;
        }

        userIds.add(n.user_id);
        return true;
      });

      /* eslint-disable no-await-in-loop */
      for (const notification of uniqueNotifications) {
        let member;
        try {
          member = await msg.guild.members.fetch(notification.user_id);
        } catch (err) {
          // Ignore if member not found

          if (err instanceof DiscordAPIError) {
            // Delete the notification if the member left
            if (err.code === RESTJSONErrorCodes.UnknownMember) {
              await deleteNotification(
                db,
                notification.guild_id,
                notification.user_id,
                notification.keyword,
              );
            }
          }

          continue;
        }

        // Ensure member can view the channel
        const memberPermissions = msg.channel.permissionsFor(member);
        if (!memberPermissions.has(PermissionFlagsBits.ViewChannel)) {
          log.debug(
            {
              guildId: msg.guildId,
              userId: member.id,
              channelId: msg.channelId,
            },
            "Member does not have permission to view channel for notification, skipping",
          );
          continue;
        }

        let desc = `${SushiiEmoji.SpeechBubble} mentioned \`${notification.keyword}\` in ${msg.url}`;
        desc += "\n";
        desc += quoteMarkdownString(msg.content);

        const avatar =
          msg.member?.displayAvatarURL() || msg.author.displayAvatarURL();

        const embed = new EmbedBuilder()
          .setColor(Color.Info)
          .setAuthor({
            name: getUserString(msg.member || msg.author),
            iconURL: avatar,
          })
          .setDescription(desc)
          .setTimestamp(new Date());

        try {
          await member.send({ embeds: [embed] });
        } catch (err) {
          // Ignore if member has DMs disabled
          continue;
        }
      }
      /* eslint-enable */
    } finally {
      span.end();
    }
  });
};
