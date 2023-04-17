import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import Context from "../../model/context";
import logger from "../../logger";
import { SlashCommandHandler } from "../handlers";
import getUserinfoEmbed from "./userinfo.service";

export default class UserinfoHandler extends SlashCommandHandler {
  serverOnly = false;

  command = new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Get information about a user")
    .addUserOption((o) =>
      o
        .setName("user")
        .setDescription(
          "The user to get information about, yourself if not provided"
        )
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    let target = interaction.options.getUser("user");

    if (!target) {
      target = interaction.user;
    }

    let member;
    if (interaction.inCachedGuild()) {
      member = await interaction.guild.members.fetch(target.id);
    }

    if (!target) {
      throw new Error("No target set, should be unreachable");
    }

    const embed = await getUserinfoEmbed(target, member);
    logger.debug("userinfo embed: %o", embed);

    await interaction.reply({
      embeds: [embed],
    });
  }
}
