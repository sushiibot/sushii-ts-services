import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  PermissionsBitField,
  EmbedBuilder,
} from "discord.js";
import dayjs from "dayjs";
import Context from "../../model/context";
import { SlashCommandHandler } from "../handlers";
import { getGuildTempBans } from "../../db/TempBan/TempBan.repository";
import db from "../../model/db";
import Color from "../../utils/colors";
import toTimestamp from "../../utils/toTimestamp";

export default class TempbanListCommand extends SlashCommandHandler {
  requiredBotPermissions = new PermissionsBitField().add("BanMembers");

  command = new SlashCommandBuilder()
    .setName("tempban-list")
    .setDescription("List all active temporary bans in the server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Not in cached guild");
    }

    const tempBans = await getGuildTempBans(db, interaction.guildId);

    if (tempBans.length === 0) {
      const embed = new EmbedBuilder()
        .setTitle("Temporary Bans")
        .setDescription("There are no active temporary bans.")
        .setColor(Color.Info)
        .toJSON();

      await interaction.reply({
        embeds: [embed],
      });

      return;
    }

    const tempBanList = tempBans.map((tempBan) => {
      const userMention = `<@${tempBan.user_id}>`;
      const startTimestamp = toTimestamp(dayjs.utc(tempBan.created_at), "f");
      const endTimeStamp = toTimestamp(dayjs.utc(tempBan.expires_at), "R");

      let s = `${userMention} (ID: \`${tempBan.user_id}\`)`;
      s += `\n╰ Expires: ${endTimeStamp}`;
      s += `\n╰ Started: ${startTimestamp}`;

      return s;
    });

    const embed = new EmbedBuilder()
      .setTitle("Temporary Bans")
      .setDescription(tempBanList.join("\n"))
      .setColor(Color.Info)
      .toJSON();

    await interaction.reply({
      embeds: [embed],
    });
  }
}
