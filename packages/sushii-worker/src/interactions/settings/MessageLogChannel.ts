import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { PermissionFlagsBits } from "discord-api-types/v10";
import { MsgLogBlockType } from "../../generated/graphql";
import Context from "../../model/context";
import Color from "../../utils/colors";
import { SlashCommandHandler } from "../handlers";

enum MsgLogSubGroup {
  Ignore = "ignore",
  UnIgnore = "unignore",
}

enum MsgLogCommandName {
  Set = "set",
  Channel = "channel",
  List = "list",
}

enum MsgLogOptionName {
  Channel = "channel",
  BlockType = "ignore_type",
}

function blockTypeToString(type: MsgLogBlockType): string {
  switch (type) {
    case MsgLogBlockType.All:
      return "edits and deletes";
    case MsgLogBlockType.Deletes:
      return "deletes only";
    case MsgLogBlockType.Edits:
      return "edits only";
  }
}

export default class MessageLogCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("msglog")
    .setDescription("Change message log settings.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addSubcommand((c) =>
      c
        .setName(MsgLogCommandName.Set)
        .setDescription("Set a channel for message logs.")
        .addChannelOption((o) =>
          o
            .setName(MsgLogOptionName.Channel)
            .setDescription("Channel to send message logs to.")
            .setRequired(true)
        )
    )
    .addSubcommandGroup((g) =>
      g
        .setName(MsgLogSubGroup.Ignore)
        .setDescription("Ignore channels from message logs.")
        .addSubcommand((c) =>
          c
            .setName(MsgLogCommandName.Channel)
            .setDescription("Ignore a channel for deleted and edited message.")
            .addChannelOption((o) =>
              o
                .setName(MsgLogOptionName.Channel)
                .setDescription("Channel to ignore.")
                .setRequired(true)
            )
            .addStringOption((o) =>
              o
                .setName(MsgLogOptionName.BlockType)
                .setDescription("What type of logs to ignore?")
                .addChoices(
                  { name: "Edits", value: MsgLogBlockType.Edits },
                  { name: "Deletes", value: MsgLogBlockType.Deletes },
                  { name: "All", value: MsgLogBlockType.All }
                )
            )
        )
        .addSubcommand((c) =>
          c
            .setName(MsgLogCommandName.List)
            .setDescription("List channels that are ignored.")
        )
    )
    .addSubcommandGroup((g) =>
      g
        .setName(MsgLogSubGroup.UnIgnore)
        .setDescription("Re-enable message logs for ignored channels.")
        .addSubcommand((c) =>
          c
            .setName(MsgLogCommandName.Channel)
            .setDescription("Re-enable message logs for an ignored channel.")
            .addChannelOption((o) =>
              o
                .setName(MsgLogOptionName.Channel)
                .setDescription("Channel to un-ignore.")
                .setRequired(true)
            )
        )
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Guild not cached");
    }

    const subgroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    switch (subgroup) {
      // Base commands
      case null: {
        switch (subcommand) {
          case MsgLogCommandName.Set:
            return this.setHandler(ctx, interaction);
          default:
            throw new Error(
              `Invalid subcommand for group ${subgroup}: ${subcommand}`
            );
        }
      }
      case MsgLogSubGroup.Ignore: {
        switch (subcommand) {
          case MsgLogCommandName.Channel:
            return this.ignoreChannelHandler(ctx, interaction);
          case MsgLogCommandName.List:
            return this.ignoreListHandler(ctx, interaction);
          default:
            throw new Error(
              `Invalid subcommand for group ${subgroup}: ${subcommand}`
            );
        }
      }
      case MsgLogSubGroup.UnIgnore: {
        switch (subcommand) {
          case MsgLogCommandName.Channel:
            return this.unignoreChannelHandler(ctx, interaction);
          default:
            throw new Error(
              `Invalid subcommand for group ${subgroup}: ${subcommand}`
            );
        }
      }
      default: {
        throw new Error(`Invalid subgroup ${subgroup}`);
      }
    }
  }

  async setHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const channel = interaction.options.getChannel(
      MsgLogOptionName.Channel,
      true
    );

    await ctx.sushiiAPI.sdk.updateGuildConfig({
      id: interaction.guildId,
      patch: {
        logMsg: channel.id,
        logMsgEnabled: true,
      },
    });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Message log updated")
          .setDescription(`<#${channel.id}>`)
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }

  async ignoreChannelHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const channel = interaction.options.getChannel(
      MsgLogOptionName.Channel,
      true
    );

    const blockType =
      interaction.options.getString(MsgLogOptionName.BlockType) ||
      MsgLogBlockType.All;

    await ctx.sushiiAPI.sdk.upsertMsgLogBlock({
      guildId: interaction.guildId,
      channelId: channel.id,
      blockType: blockType as MsgLogBlockType,
    });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Added new message log ignore")
          .setDescription(
            `ignoring ${blockTypeToString(blockType as MsgLogBlockType)} in <#${
              channel.id
            }>`
          )
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }

  async ignoreListHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const ignoredChannels = await ctx.sushiiAPI.sdk.getMsgLogBlocks({
      guildId: interaction.guildId,
    });

    const ignoredChannelsStr =
      ignoredChannels.allMsgLogBlocks?.nodes
        .map((c) => `<#${c.channelId}> - ${blockTypeToString(c.blockType)}`)
        .join("\n") || "No channels are ignored";

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Ignored Channels - Message Log")
          .setDescription(ignoredChannelsStr)
          .setFooter({
            text: "These channels won't show up in message logs for deleted and edited messages.",
          })
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }

  async unignoreChannelHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const channel = interaction.options.getChannel(
      MsgLogOptionName.Channel,
      true
    );

    await ctx.sushiiAPI.sdk.deleteMsgLogBlock({
      channelId: channel.id,
      guildId: interaction.guildId,
    });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Channel message logs re-enabled")
          .setDescription(`<#${channel.id}>`)
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }
}
