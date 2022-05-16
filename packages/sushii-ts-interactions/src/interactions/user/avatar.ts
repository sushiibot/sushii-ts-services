import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import { isGuildInteraction } from "discord-api-types/utils/v10";
import { APIChatInputApplicationCommandInteraction } from "discord-api-types/v10";
import { t } from "i18next";
import Context from "../../model/context";
import getInvokerUser from "../../utils/interactions";
import { SlashCommandHandler } from "../handlers";
import CommandInteractionOptionResolver from "../resolver";

export default class AvatarCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("View someone's avatar.")
    .addUserOption((o) =>
      o
        .setName("user")
        .setDescription("Who to get the avatar of, your own if not provided.")
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

    const target = options.getUser("user") || getInvokerUser(interaction);
    const embeds = [];

    // User av
    const userFaceURL = ctx.CDN.userFaceURL(target, {
      size: 4096,
    });
    const userEmbed = new EmbedBuilder()
      .setTitle(
        t("avatar.user_avatar_title", {
          ns: "commands",
          username: target.username,
        })
      )
      .setURL(userFaceURL)
      .setImage(userFaceURL)
      .toJSON();
    embeds.push(userEmbed);

    // Guild av
    if (isGuildInteraction(interaction)) {
      try {
        const member = await ctx.REST.getMember(
          interaction.guild_id,
          target.id
        );

        const memberFaceURL = ctx.CDN.memberFaceURL(
          interaction.guild_id,
          member,
          target.id,
          {
            size: 4096,
          }
        );

        if (memberFaceURL) {
          const memberEmbed = new EmbedBuilder()
            .setTitle(
              t("avatar.member_avatar_title", {
                ns: "commands",
                username: member.nick || target.username,
              })
            )
            .setURL(memberFaceURL)
            .setImage(memberFaceURL)
            .toJSON();

          embeds.push(memberEmbed);
        }
      } catch (e) {
        // Ignore if member not found
      }
    }

    await ctx.REST.interactionReply(interaction, {
      embeds,
    });
  }
}
