import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { t } from "i18next";
import { sql } from "kysely";
import Context from "../../model/context";
import db from "../../infrastructure/database/config/db";
import Color from "../../utils/colors";
import { SlashCommandHandler } from "../handlers";

export default class PingCommand extends SlashCommandHandler {
  serverOnly = false;

  command = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check sushii's ping.")
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const discordRestStart = process.hrtime.bigint();
    await interaction.reply(
      t("ping.title", {
        ns: "commands",
      }),
    );
    const discordRestEnd = process.hrtime.bigint();

    const sushiiDbStart = process.hrtime.bigint();

    // Just just to check latency
    await sql`select 1 + 1`.execute(db);

    const sushiiDbEnd = process.hrtime.bigint();

    const embed = new EmbedBuilder()
      .setTitle(t("ping.title"))
      .setDescription(
        t("ping.description", {
          ns: "commands",
          restMs: (
            (discordRestEnd - discordRestStart) /
            BigInt(1e6)
          ).toString(),
          sushiiDbMs: ((sushiiDbEnd - sushiiDbStart) / BigInt(1000)).toString(),
        }),
      )
      .setColor(Color.Success);

    await interaction.editReply({
      content: "",
      embeds: [embed.toJSON()],
    });
  }
}
