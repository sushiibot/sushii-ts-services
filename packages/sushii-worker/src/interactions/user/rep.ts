import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { isDayjs } from "dayjs";
import i18next from "i18next";
import Context from "../../model/context";
import Color from "../../utils/colors";
import { SlashCommandHandler } from "../handlers";
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
        .setRequired(true),
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const target = interaction.options.getUser("user", true);
    const res = await repForUser(ctx, interaction.user, target);

    let embed = new EmbedBuilder();

    if (isDayjs(res)) {
      embed = embed.setColor(Color.Error).setDescription(
        i18next.t("rep.cooldown", {
          ns: "commands",
          nexRepTimestamp: res.unix(),
        }),
      );
    } else {
      embed = new EmbedBuilder().setColor(Color.Success).setDescription(
        i18next.t("rep.success", {
          ns: "commands",
          username: target.username,
          oldAmount: res.oldAmount,
          newAmount: res.newAmount,
        }),
      );
    }

    await interaction.reply({
      embeds: [embed.toJSON()],
    });
  }
}
