import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { t } from "i18next";
import Context from "../../model/context";
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
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    const discordRestStart = process.hrtime.bigint();
    await interaction.reply(
      t("ping.title", {
        ns: "commands",
      })
    );
    const discordRestEnd = process.hrtime.bigint();

    const sushiiRestStart = process.hrtime.bigint();
    // Doesn't really matter if this is a valid ID or not, just to check latency
    await ctx.sushiiAPI.sdk.userByID({
      id: interaction.user.id,
    });
    const sushiiRestEnd = process.hrtime.bigint();

    const embed = new EmbedBuilder()
      .setTitle(t("ping.title"))
      .setDescription(
        t("ping.description", {
          ns: "commands",
          restMs: (
            (discordRestEnd - discordRestStart) /
            BigInt(1e6)
          ).toString(),
          sushiiApiMs: (
            (sushiiRestEnd - sushiiRestStart) /
            BigInt(1e6)
          ).toString(),
        })
      )
      .setColor(Color.Success);

    await interaction.editReply({
      content: "",
      embeds: [embed.toJSON()],
    });
  }
}
