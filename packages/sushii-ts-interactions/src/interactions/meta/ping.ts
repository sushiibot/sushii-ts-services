import { SlashCommandBuilder, Embed } from "@discordjs/builders";
import { APIChatInputApplicationCommandInteraction } from "discord-api-types/v9";
import { t } from "i18next";
import Context from "../../context";
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
    interaction: APIChatInputApplicationCommandInteraction
  ): Promise<void> {
    const discordRestStart = process.hrtime.bigint();
    await ctx.REST.interactionReply(interaction, {
      content: t("ping.title", {
        ns: "commands",
      }),
    });
    const discordRestEnd = process.hrtime.bigint();

    const sushiiRestStart = process.hrtime.bigint();
    // Doesn't really matter if this is a valid ID or not, just to check latency
    await ctx.sushiiAPI.sdk.userByID({
      id: interaction.user?.id || interaction.member?.user.id,
    });
    const sushiiRestEnd = process.hrtime.bigint();

    const embed = new Embed().setTitle(t("ping.title")).setDescription(
      t("ping.description", {
        ns: "commands",
        restMs: ((discordRestEnd - discordRestStart) / BigInt(1e6)).toString(),
        sushiiApiMs: (
          (sushiiRestEnd - sushiiRestStart) /
          BigInt(1e6)
        ).toString(),
      })
    );

    await ctx.REST.interactionEditOriginal(interaction, {
      content: "",
      embeds: [embed],
    });
  }
}
