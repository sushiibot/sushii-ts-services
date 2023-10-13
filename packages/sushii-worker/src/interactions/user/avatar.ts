import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { t } from "i18next";
import Context from "../../model/context";
import Color from "../../utils/colors";
import { SlashCommandHandler } from "../handlers";

export default class AvatarCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("View someone's avatar.")
    .addUserOption((o) =>
      o
        .setName("user")
        .setDescription("Who to get the avatar of, your own if not provided."),
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const target =
      interaction.options.getUser("user", false) || interaction.user;
    const embeds = [];

    // User av
    const userFaceURL = target.displayAvatarURL({
      size: 4096,
    });
    const userEmbed = new EmbedBuilder()
      .setTitle(
        t("avatar.user_avatar_title", {
          ns: "commands",
          username: target.username,
        }),
      )
      .setURL(userFaceURL)
      .setImage(userFaceURL)
      .setColor(Color.Success)
      .toJSON();
    embeds.push(userEmbed);

    // Guild av
    if (interaction.inCachedGuild()) {
      try {
        const member = await interaction.guild.members.fetch(target.id);

        // Not displayAvatarURL since we don't want it to fallback to user pfp
        const memberFaceURL = member.avatarURL({
          size: 4096,
        });

        if (memberFaceURL) {
          const memberEmbed = new EmbedBuilder()
            .setTitle(
              t("avatar.member_avatar_title", {
                ns: "commands",
                username: member.nickname || target.username,
              }),
            )
            .setURL(memberFaceURL)
            .setImage(memberFaceURL)
            .setColor(Color.Success)
            .toJSON();

          embeds.push(memberEmbed);
        }
      } catch (err) {
        // Ignore error
      }
    }

    await interaction.reply({
      embeds,
    });
  }
}
