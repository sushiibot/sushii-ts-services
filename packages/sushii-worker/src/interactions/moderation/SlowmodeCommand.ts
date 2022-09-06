import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import {
  APIChatInputApplicationCommandGuildInteraction,
  MessageFlags,
  PermissionFlagsBits,
} from "discord-api-types/v10";
import CommandInteractionOptionResolver from "../resolver";
import Context from "../../model/context";
import { SlashCommandHandler } from "../handlers";
import { interactionReplyErrorMessage } from "../responses/error";
import Color from "../../utils/colors";
import parseDuration from "../../utils/parseDuration";

enum SlowmodeOption {
  Duration = "duration",
  Channel = "channel",
}

export default class SlowmodeCommand extends SlashCommandHandler {
  serverOnly = true;

  requiredBotPermissions = PermissionFlagsBits.ManageChannels.toString();

  command = new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Adjust slowmode for channels.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDMPermission(false)
    .addStringOption((o) =>
      o
        .setName(SlowmodeOption.Duration)
        .setDescription(
          "Duration to set slowmode to, e.g. 5s or 1m. Set to 0 to disable."
        )
        .setRequired(true)
    )
    .addChannelOption((o) =>
      o
        .setName(SlowmodeOption.Channel)
        .setDescription(
          "Channel to set slowmode for. Defaults to current channel."
        )
        .setRequired(false)
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction
  ): Promise<void> {
    const options = new CommandInteractionOptionResolver(
      interaction.data.options,
      interaction.data.resolved
    );

    const durationStr = options.getString(SlowmodeOption.Duration);
    if (!durationStr) {
      throw new Error("Missing duration");
    }

    const channel = options.getChannel(SlowmodeOption.Channel);

    const disableSlowmode = durationStr === "0";

    const duration = parseDuration(durationStr);
    if (!duration && !disableSlowmode) {
      await interactionReplyErrorMessage(
        ctx,
        interaction,
        "Invalid duration, please use a valid duration like 5s or 1m."
      );

      return;
    }

    const res = await ctx.REST.modifyChannel(
      channel?.id || interaction.channel_id,
      {
        // Will only be null if disableSlowmode is true
        rate_limit_per_user: duration?.asSeconds() || 0,
      }
    );

    if (res.err) {
      await interactionReplyErrorMessage(
        ctx,
        interaction,
        `Failed to update slowmode: ${res.val.message}`
      );

      return;
    }

    await ctx.REST.interactionReply(interaction, {
      embeds: [
        new EmbedBuilder()
          .setTitle("Updated slowmode")
          .addFields(
            {
              name: "Channel",
              value: `<#${res.val.id}>`,
            },
            {
              name: "Slowmode",
              value: duration ? duration.humanize() : "Disabled",
            }
          )
          .setColor(Color.Success)
          .toJSON(),
      ],
      flags: MessageFlags.Ephemeral,
    });
  }
}
