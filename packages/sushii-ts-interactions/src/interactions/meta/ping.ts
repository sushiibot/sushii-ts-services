import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import { APIChatInputApplicationCommandInteraction } from "discord-api-types/v10";
import { t } from "i18next";
import Context from "../../context";
import getInvokerUser from "../../utils/interactions";
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
      id: getInvokerUser(interaction).id,
    });
    const sushiiRestEnd = process.hrtime.bigint();

    const embed = new EmbedBuilder().setTitle(t("ping.title")).setDescription(
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
      embeds: [embed.toJSON()],
    });
  }
}
