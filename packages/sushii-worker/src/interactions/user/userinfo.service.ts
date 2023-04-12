import { EmbedBuilder, GuildMember, User } from "discord.js";
import { APIEmbed } from "discord-api-types/v10";
import Color from "../../utils/colors";
import { getCreatedTimestampSeconds } from "../../utils/snowflake";

export default async function getUserinfoEmbed(
  user: User,
  member: GuildMember | undefined
): Promise<APIEmbed> {
  let authorName = user.username;
  if (member?.nickname) {
    authorName = `${user.username} ~ ${member.nickname}`;
  }

  const faceURL = member?.displayAvatarURL() || user.displayAvatarURL();

  let embed = new EmbedBuilder()
    .setAuthor({
      name: authorName,
      iconURL: faceURL,
      url: faceURL,
    })
    .setThumbnail(faceURL)
    .setImage(user.bannerURL() || null)
    .setFooter({
      text: `ID: ${user.id}`,
    })
    .setColor(Color.Success);

  const createdTimestamp = getCreatedTimestampSeconds(user.id);

  // Creation times
  embed = embed.addFields([
    {
      name: "Account Created",
      value: `<t:${createdTimestamp}:F> (<t:${createdTimestamp}:R>)`,
    },
  ]);

  if (member) {
    embed = embed.setColor(member.displayColor);

    // 1024 char limit, 40 roles * 25 length each mention = 1000
    const trimmedRoles = [...member.roles.cache.values()].slice(0, 40);
    let rolesStr = trimmedRoles.map((role) => role.toString()).join(" ");

    if (member.roles.cache.size > 40) {
      rolesStr += ` and ${member.roles.cache.size - 40} more roles...`;
    }

    embed = embed.addFields([
      {
        name: "Roles",
        value: rolesStr || "Member has no roles",
      },
      {
        name: "Joined Server",
        value: `<t:${member.joinedTimestamp}:F> (<t:${member.joinedTimestamp}:R>)`,
      },
    ]);

    if (member.premiumSinceTimestamp) {
      embed = embed.addFields([
        {
          name: "Boosting Since",
          value: `<t:${member.premiumSinceTimestamp}:F> (<t:${member.premiumSinceTimestamp}:R>)`,
        },
      ]);
    }
  }

  return embed.toJSON();
}
