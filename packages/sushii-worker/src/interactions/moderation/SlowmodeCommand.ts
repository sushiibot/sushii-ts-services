import {
  EmbedBuilder,
  SlashCommandBuilder,
  MessageFlags,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  ChannelType,
  DiscordAPIError,
  InteractionContextType,
} from "discord.js";
import dayjs from "dayjs";
import plugin from "dayjs/plugin/duration";
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
  ChannelOption = "channel",
}

export default class SlowmodeCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Adjust slowmode for channels.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setContexts(InteractionContextType.Guild)
    .addStringOption((o) =>
      o
        .setName(SlowmodeOption.Duration)
        .setDescription(
          "Duration to set slowmode to (Example: 5s or 1m). Set to 0 to disable.",
        )
        .setRequired(true),
    )
    .addChannelOption((o) =>
      o
        .setName(SlowmodeOption.ChannelOption)
        .setDescription(
          "Channel to set slowmode for. Defaults to the current channel.",
        )
        .setRequired(false),
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Guild not cached");
    }

    const durationStr = interaction.options.getString(SlowmodeOption.Duration);
    if (!durationStr) {
      throw new Error("Missing duration");
    }

    const channelOption = interaction.options.getChannel(
      SlowmodeOption.ChannelOption,
      false,
      [ChannelType.GuildText],
    );

    const targetChanel = channelOption || interaction.channel;

    if (!targetChanel) {
      throw new Error("Missing channel");
    }

    const isUnitless = RE_ONLY_NUMBERS.test(durationStr.trim());

    let duration: plugin.Duration | null = null;
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
        true,
      );

      return;
    }

    if (duration.asSeconds() > 21600) {
      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        "Slowmode must be less than 6 hours.",
        true,
      );

      return;
    }

    try {
      await targetChanel.edit({
        rateLimitPerUser: duration!.asSeconds(),
      });
    } catch (err) {
      if (err instanceof DiscordAPIError) {
        await interactionReplyErrorMessage(
          ctx,
          interaction,
          `Failed to update slowmode: ${err.message}`,
          true,
        );

        return;
      }

      throw err;
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

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Updated slowmode")
          .addFields(
            {
              name: "Channel",
              value: `<#${targetChanel.id}>`,
            },
            {
              name: "Duration",
              value: formattedDuration || "Disabled",
            },
          )
          .setColor(Color.Success),
      ],
      flags: MessageFlags.Ephemeral,
    });
  }
}
