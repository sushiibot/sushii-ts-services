import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import { isGuildInteraction } from "discord-api-types/utils/v10";
import { APIChatInputApplicationCommandInteraction } from "discord-api-types/v10";
import { t } from "i18next";
import Context from "../../context";
import getInvokerUser from "../../utils/interactions";
import { SlashCommandHandler } from "../handlers";
import CommandInteractionOptionResolver from "../resolver";

export default class KickCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member.")
    .addUserOption((o) =>
      o.setName("user").setDescription("Who to kick.").setRequired(true)
    )
    .addStringOption((o) =>
      o
        .setName("reason")
        .setDescription("Reason for kicking this user.")
        .setRequired(false)
    )
    .addAttachmentOption((o) =>
      o
        .setName("attachment")
        .setDescription("Additional media to attach to the case.")
        .setRequired(false)
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandInteraction
  ): Promise<void> {
    if (!isGuildInteraction(interaction)) {
      throw new Error("Can only be used in guild");
    }

    const options = new CommandInteractionOptionResolver(
      interaction.data.options,
      interaction.data.resolved
    );

    const invoker = getInvokerUser(interaction);

    const target = options.getUser("user");

    if (!target) {
      throw new Error("No user provided.");
    }

    const reason = options.getString("reason");
    const attachment = options.getAttachment("attachment");

    // User av
    const userFaceURL = ctx.CDN.userFaceURL(target);
    const userEmbed = new EmbedBuilder()
      .setTitle(
        t("kick.success", {
          ns: "commands",
          id: target.id,
        })
      )
      .setURL(userFaceURL)
      .setImage(userFaceURL);

    await ctx.sushiiAPI.sdk.createModLog({
      modLog: {
        guildId: interaction.guild_id,
        // TODO: Fetch next caseId: ???,
        action: "kick",
        pending: true,
        userId: target.id,
        userTag: target.discriminator,
        executorId: invoker.id,
        actionTime: dayjs().toISOString(),
        reason,
        attachments: [attachment?.url || null],
        // This is set in the kick listener
        msgId: undefined,
      },
    });

    await ctx.REST.interactionReply(interaction, {
      embeds: [userEmbed.toJSON()],
    });
  }
}
