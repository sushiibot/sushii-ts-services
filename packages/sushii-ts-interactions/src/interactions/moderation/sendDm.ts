import { EmbedBuilder } from "@discordjs/builders";
import {
  APIChatInputApplicationCommandGuildInteraction,
  APIMessage,
} from "discord-api-types/v10";
import { Err, Result } from "ts-results";
import Context from "../../model/context";
import Color from "../../utils/colors";
import { ActionType } from "./ActionType";
import ModActionData from "./ModActionData";

async function buildEmbed(
  ctx: Context,
  interaction: APIChatInputApplicationCommandGuildInteraction,
  data: ModActionData,
  action: ActionType
): Promise<EmbedBuilder> {
  const { redisGuildByGuildId } = await ctx.sushiiAPI.sdk.getRedisGuild({
    guild_id: interaction.guild_id,
  });

  const guildName =
    redisGuildByGuildId?.name || `Server ID ${interaction.guild_id}`;
  const guildIcon = redisGuildByGuildId?.icon
    ? ctx.CDN.cdn.icon(interaction.guild_id, redisGuildByGuildId?.icon)
    : undefined;

  const fields = [];

  if (data.reason) {
    fields.push({
      name: "Reason",
      value: data.reason,
    });
  }

  if (data.timeoutDuration) {
    // Fine to unwrap as it is checked before calling sendModActionDM
    const timeoutUntil = data.communicationDisabledUntil().unwrap();

    fields.push({
      name: "Duration",
      value: `${data.timeoutDuration.humanize()} - Expires <t:${timeoutUntil.unix()}:R>`,
    });
  }

  return new EmbedBuilder()
    .setTitle(`You have been ${ActionType.toPastTense(action)} in a server`)
    .setAuthor({
      name: guildName,
      iconURL: guildIcon,
    })
    .setFields(fields)
    .setColor(Color.Warning);
}

export default async function sendModActionDM(
  ctx: Context,
  interaction: APIChatInputApplicationCommandGuildInteraction,
  data: ModActionData,
  action: ActionType
): Promise<Result<APIMessage, string>> {
  const embed = await buildEmbed(ctx, interaction, data, action);

  const res = await ctx.REST.dmUser(data.targetUser.id, {
    embeds: [embed.toJSON()],
  });

  if (res.err) {
    if (res.val.code === "50007") {
      return Err("User has DMs disabled or bot is blocked.");
    }
  }

  return res.mapErr((e) => e.message);
}
