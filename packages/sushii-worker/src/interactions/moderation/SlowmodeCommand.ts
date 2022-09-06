import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import {
  APIChatInputApplicationCommandGuildInteraction,
  MessageFlags,
  PermissionFlagsBits,
} from "discord-api-types/v10";
import dayjs from "dayjs";
import CommandInteractionOptionResolver from "../resolver";
import Context from "../../model/context";
import { SlashCommandHandler } from "../handlers";
import {
  interactionReplyErrorMessage,
  interactionReplyErrorPlainMessage,
} from "../responses/error";
import Color from "../../utils/colors";
import parseDuration from "../../utils/parseDuration";

const RE_ONLY_NUMBERS = /^\d+$/;

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
          "Duration to set slowmode to (Example: 5s or 1m). Set to 0 to disable."
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

    const isUnitless = RE_ONLY_NUMBERS.test(durationStr.trim());

    let duration = null;
    if (isUnitless) {
      duration = dayjs.duration({
        seconds: parseInt(durationStr, 10),
      });
    } else {
      duration = parseDuration(durationStr);
    }

    if (!duration) {
      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        "Invalid duration, please use a valid duration like 5s or 1m.",
        true
      );

      return;
    }

    if (duration.asSeconds() > 21600) {
      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        "Slowmode must be less than 6 hours.",
        true
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
        `Failed to update slowmode: ${res.val.message}`,
        true
      );

      return;
    }

    let formattedDuration = "";

    const seconds = duration.seconds();
    const minutes = duration.minutes();
    const hours = duration.hours();

    if (hours) {
      formattedDuration += `${hours} hour${hours > 1 ? "s" : ""} `;
    }

    if (minutes) {
      formattedDuration += `${minutes} minute${minutes > 1 ? "s" : ""} `;
    }

    if (seconds) {
      formattedDuration += `${seconds} second${seconds > 1 ? "s" : ""} `;
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
              name: "Duration",
              value: formattedDuration || "Disabled",
            }
          )
          .setColor(Color.Success)
          .toJSON(),
      ],
      flags: MessageFlags.Ephemeral,
    });
  }
}
