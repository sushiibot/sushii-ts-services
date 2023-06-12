import { EmbedBuilder, GuildFeature, GuildMember, User } from "discord.js";
import dayjs from "dayjs";
import { getCreatedTimestampSeconds } from "../../../utils/snowflake";
import timestampToUnixTime from "../../../utils/timestampToUnixTime";
import SushiiEmoji from "../../../constants/SushiiEmoji";
import Color from "../../../utils/colors";
import logger from "../../../logger";

export interface UserLookupBan {
  guild_id: string;
  guild_name: string | null;
  guild_features: `${GuildFeature}`[] | null;
  guild_members: number | null;
  reason: string | null;
  action_time: Date | null;
  lookup_details_opt_in: boolean | null;
}

function getFeatureEmojis(
  guildFeatures: UserLookupBan["guild_features"]
): string {
  if (!guildFeatures) {
    return "";
  }

  const emojis = [];

  if (guildFeatures.includes("VERIFIED")) {
    emojis.push(SushiiEmoji.VerifiedIcon);
  }

  if (guildFeatures.includes("PARTNERED")) {
    emojis.push(SushiiEmoji.PartnerIcon);
  }

  if (guildFeatures.includes("DISCOVERABLE")) {
    emojis.push(SushiiEmoji.DiscoverableIcon);
  }

  if (emojis.length === 0) {
    return "";
  }

  const emojisStr = emojis.join(" ");

  // Add a space at the end
  return `${emojisStr} `;
}

export default async function buildUserLookupEmbed(
  targetUser: User,
  targetMember: GuildMember | undefined,
  bans: UserLookupBan[],
  guildOptedIn: boolean,
  {
    showBasicInfo,
    botHasBanPermission,
  }: {
    showBasicInfo: boolean;
    botHasBanPermission: boolean;
  }
): Promise<EmbedBuilder> {
  let embed = new EmbedBuilder()
    .setTitle("🔎 User Lookup")
    .setAuthor({
      name: `${targetUser.tag} - ${targetUser.id}`,
      iconURL: targetUser.displayAvatarURL(),
    })
    .setColor(Color.Info);

  if (bans.length === 0) {
    embed = embed.setDescription("No bans found for this user.");
  } else {
    let desc = "";

    // Sort bans by guild_members
    bans.sort((a, b) => {
      if (a.guild_members === null && b.guild_members === null) {
        return 0;
      }

      if (a.guild_members === null) {
        return 1;
      }

      if (b.guild_members === null) {
        return -1;
      }

      return b.guild_members - a.guild_members;
    });

    for (const ban of bans) {
      // Add emojis
      desc += getFeatureEmojis(ban.guild_features);

      // If the current guild is opted out, show no reasons and anonymous for all.
      // Otherwise show the guild name and reason if the other server opted in.
      // OR If sushii doesn't have ban permissions, show anonymous for all.
      if (!guildOptedIn || !ban.lookup_details_opt_in || !botHasBanPermission) {
        desc += "`anonymous`";

        if (ban.action_time) {
          logger.debug(
            {
              date: ban.action_time,
              offset: ban.action_time.getTimezoneOffset(),
            },
            "ban.action_time"
          );

          desc += ` - <t:${dayjs.utc(ban.action_time.getTime()).unix()}:R>`;
        }

        desc += "\n";
        continue;
      }

      if (ban.guild_name && ban.guild_id) {
        desc += `**${ban.guild_name}** - \`${ban.guild_id}\``;

        if (ban.action_time) {
          logger.debug(
            {
              date: ban.action_time,
              offset: ban.action_time.getTimezoneOffset(),
            },
            "ban.action_time"
          );

          desc += ` - <t:${dayjs.utc(ban.action_time.getTime()).unix()}:R>`;
        }

        if (ban.reason) {
          desc += "\n";
          desc += `╰ Reason: ${ban.reason}`;
        }
      }

      desc += "\n";
    }

    embed = embed.setDescription(desc);
  }

  const fields = [];

  if (showBasicInfo) {
    const createdTimestamp = getCreatedTimestampSeconds(targetUser.id);
    fields.push({
      name: "Account Created",
      value: `<t:${createdTimestamp}:F> (<t:${createdTimestamp}:R>)`,
    });

    if (targetMember?.joinedTimestamp) {
      const ts = timestampToUnixTime(targetMember.joinedTimestamp);

      fields.push({
        name: "Joined Server",
        value: `<t:${ts}:F> (<t:${ts}:R>)`,
      });
    }
  }

  // If server opted in but sushii can't view bans, show a warning
  if (guildOptedIn && !botHasBanPermission) {
    fields.push({
      name: "⚠ Bot Missing Permissions",
      value:
        "I am missing the `Ban Members` permission. I need this to view the server bans, please give me this permission to view server reasons!",
    });
  }

  const footerText = guildOptedIn
    ? "Anonymous servers have not opted into sharing server name and ban reasons."
    : "Opted out of server name and reason sharing. To show other server name and reasons from other servers, use /settings lookup";

  return embed.addFields(fields).setFooter({
    text: footerText,
  });
}
