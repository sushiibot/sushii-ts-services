import { SlashCommandBuilder, Embed } from "@discordjs/builders";
import { isGuildInteraction } from "discord-api-types/utils/v9";
import { APIChatInputApplicationCommandInteraction } from "discord-api-types/v9";
import { t } from "i18next";
import Context from "../../context";
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
    const userFaceURL = ctx.CDN.userFaceURL(target);
    const userEmbed = new Embed()
      .setTitle(
        t("avatar.user_avatar", {
          ns: "commands",
          username: target.username,
        })
      )
      .setURL(userFaceURL)
      .setImage(userFaceURL);
    embeds.push(userEmbed);

    // Guild av
    if (isGuildInteraction(interaction)) {
      const member = await ctx.REST.getMember(interaction.guild_id, target.id);

      const memberFaceURL = ctx.CDN.memberFaceURL(
        interaction.guild_id,
        member,
        target.id
      );
      const memberEmbed = new Embed()
        .setTitle(
          t("avatar.member_avatar", {
            ns: "commands",
            username: member.nick || target.username,
          })
        )
        .setURL(userFaceURL)
        .setImage(memberFaceURL);

      embeds.push(memberEmbed);
    }

    await ctx.REST.interactionReply(interaction, {
      embeds,
    });
  }
}
