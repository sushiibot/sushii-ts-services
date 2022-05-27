import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import { isDayjs } from "dayjs";
import { APIChatInputApplicationCommandInteraction } from "discord-api-types/v10";
import i18next from "i18next";
import Context from "../../model/context";
import Color from "../../utils/colors";
import getInvokerUser from "../../utils/interactions";
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
      throw new Error("no rep user");
    }

    const res = await repForUser(
      ctx,
      interaction,
      getInvokerUser(interaction),
      target
    );

    let embed = new EmbedBuilder();

    if (isDayjs(res)) {
      embed = embed.setColor(Color.Error).setDescription(
        i18next.t("rep.cooldown", {
          ns: "commands",
          nexRepTimestamp: res.unix(),
        })
      );
    } else {
      embed = new EmbedBuilder().setColor(Color.Success).setDescription(
        i18next.t("rep.success", {
          ns: "commands",
          username: target.username,
          oldAmount: res.oldAmount,
          newAmount: res.newAmount,
        })
      );
    }

    await ctx.REST.interactionReply(interaction, {
      embeds: [embed.toJSON()],
    });
  }
}
