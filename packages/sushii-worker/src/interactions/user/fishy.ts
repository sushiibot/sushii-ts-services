import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { isDayjs } from "dayjs";
import i18next from "i18next";
import Color from "../../utils/colors";
import { SlashCommandHandler } from "../handlers";
import { fishyForUser } from "./fishy.service";

export default class FishyCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("fishy")
    .setDescription("Catch some fish!")
    .addUserOption((o) =>
      o
        .setName("user")
        .setDescription("Who to fishy for or yourself if you have no friends")
        .setRequired(true),
    )
    .toJSON();

  async handler(interaction: ChatInputCommandInteraction): Promise<void> {
    const target = interaction.options.getUser("user", true);

    const res = await fishyForUser(interaction.user, target);

    let embed = new EmbedBuilder();
    if (isDayjs(res)) {
      embed = embed.setColor(Color.Error).setDescription(
        i18next.t("fishy.cooldown", {
          ns: "commands",
          nextFishyTimestamp: res.unix(),
        }),
      );
    } else {
      embed = embed.setColor(Color.Success).setDescription(
        i18next.t("fishy.success", {
          ns: "commands",
          caughtType: res.caughtType,
          username: target.username,
          count: res.caughtAmount,
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
