import { SlashCommandBuilder, Embed } from "@discordjs/builders";
import { APIChatInputApplicationCommandInteraction } from "discord-api-types/v9";
import i18next from "i18next";
import Context from "../../context";
import { SlashCommandHandler } from "../handlers";
import CommandInteractionOptionResolver from "../resolver";
import repForUser from "./rep.service";

export default class RepCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("rep")
    .setDescription("Give someone some reputation")
    .addUserOption((o) =>
      o
        .setName("user")
        .setDescription("Who to give reputation to.")
        .setRequired(true)
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandInteraction
  ): Promise<void> {
    const options = new CommandInteractionOptionResolver(
      interaction.data.options,
      interaction.data.resolved
    );

    const target = options.getUser("user");
    if (!target) {
      await ctx.REST.interactionReply(interaction, {
        content: "You need to provide a user to fishy for!",
      });

      return;
    }

    const res = await repForUser(ctx, interaction, target);

    const embed = new Embed().setDescription(
      i18next.t("rep.success", {
        ns: "commands",
        username: target.username,
        oldAmount: res.oldAmount,
        newAmount: res.newAmount,
      })
    );

    await ctx.REST.interactionReply(interaction, {
      embeds: [embed],
    });
  }
}
