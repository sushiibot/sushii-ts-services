import { EmbedBuilder, GuildFeature, GuildMember, User } from "discord.js";
import { getCreatedTimestampSeconds } from "../../../utils/snowflake";
import timestampToUnixTime from "../../../utils/timestampToUnixTime";
import SushiiEmoji from "../../../constants/SushiiEmoji";
import Color from "../../../utils/colors";

export interface UserLookupBan {
  guild_id: string;
  guild_name: string | null;
  guild_features: `${GuildFeature}`[] | null;
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

  const emojisStr = emojis.join("");

  // Add a space at the end
  return `${emojisStr} `;
}

export default async function buildUserLookupEmbed(
  targetUser: User,
  targetMember: GuildMember | undefined,
  bans: UserLookupBan[],
  guildOptedIn: boolean,
  showBasicInfo: boolean = true
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

    for (const ban of bans) {
      // Add emojis
      desc += getFeatureEmojis(ban.guild_features);

      // If the current guild is opted out, show no reasons and anonymous for all.
      // Otherwise show the guild name and reason if the other server opted in.
      if (!guildOptedIn || !ban.lookup_details_opt_in) {
        desc += "`anonymous`";

        if (ban.action_time) {
          desc += ` - <t:${ban.action_time.toUTCString()}:R>`;
        }

        desc += "\n";
        continue;
      }

      if (ban.guild_name && ban.guild_id) {
        desc += `**${ban.guild_name}** - \`${ban.guild_id}\``;

        if (ban.action_time) {
          desc += ` - <t:${ban.action_time.toUTCString()}:R>`;
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

  const footerText = guildOptedIn
    ? "Anonymous servers have not opted into sharing server name and ban reasons."
    : "Opted out of server name and reason sharing. To show other server name and reasons from other servers, use /settings lookup";

  return embed.addFields(fields).setFooter({
    text: footerText,
  });
}
