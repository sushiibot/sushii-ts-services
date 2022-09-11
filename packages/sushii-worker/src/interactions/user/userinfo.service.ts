import { EmbedBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import {
  APIApplicationCommandInteraction,
  APIEmbed,
  APIGuildMember,
  APIInteractionDataResolvedGuildMember,
  APIUser,
} from "discord-api-types/v10";
import Context from "../../model/context";
import Color from "../../utils/colors";
import { getCreatedTimestampSeconds } from "../../utils/snowflake";

export default async function getUserinfoEmbed(
  ctx: Context,
  _interaction: APIApplicationCommandInteraction,
  user: APIUser,
  member: APIGuildMember | APIInteractionDataResolvedGuildMember | undefined
): Promise<APIEmbed> {
  let authorName = user.username;
  if (member?.nick) {
    authorName = `${user.username} ~ ${member.nick}`;
  }

  const faceURL = ctx.CDN.userFaceURL(user);

  let embed = new EmbedBuilder()
    .setAuthor({
      name: authorName,
      iconURL: faceURL,
      url: faceURL,
    })
    .setThumbnail(faceURL)
    // Fine if they don't have banner
    .setImage(ctx.CDN.userBannerURL(user))
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
    const joinedTimestamp = dayjs(member.joined_at);

    // 1024 char limit, 40 roles * 25 length each mention = 1000
    const trimmedRoles = member.roles.slice(0, 40);
    let rolesStr = trimmedRoles.map((id) => `<@&${id}>`).join(" ");

    if (member.roles.length > 40) {
      rolesStr += ` and ${member.roles.length - 40} more roles...`;
    }

    embed = embed.addFields([
      {
        name: "Roles",
        value: rolesStr || "Member has no roles",
      },
      {
        name: "Joined Server",
        value: `<t:${joinedTimestamp.unix()}:F> (<t:${joinedTimestamp.unix()}:R>)`,
      },
    ]);

    if (member.premium_since) {
      const premiumSinceTimestamp = dayjs(member.premium_since);

      embed = embed.addFields([
        {
          name: "Boosting Since",
          value: `<t:${premiumSinceTimestamp.unix()}:F> (<t:${premiumSinceTimestamp.unix()}:R>)`,
        },
      ]);
    }
  }

  return embed.toJSON();
}
