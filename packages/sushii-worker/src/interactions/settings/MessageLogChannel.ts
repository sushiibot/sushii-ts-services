import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import {
  APIChatInputApplicationCommandGuildInteraction,
  PermissionFlagsBits,
} from "discord-api-types/v10";
import { MsgLogBlockType } from "../../generated/graphql";
import Context from "../../model/context";
import Color from "../../utils/colors";
import { SlashCommandHandler } from "../handlers";
import CommandInteractionOptionResolver from "../resolver";

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
    interaction: APIChatInputApplicationCommandGuildInteraction
  ): Promise<void> {
    const options = new CommandInteractionOptionResolver(
      interaction.data.options,
      interaction.data.resolved
    );

    const subgroup = options.getSubcommandGroup();
    const subcommand = options.getSubcommand();

    switch (subgroup) {
      // Base commands
      case null: {
        switch (subcommand) {
          case MsgLogCommandName.Set:
            return this.setHandler(ctx, interaction, options);
          default:
            throw new Error(
              `Invalid subcommand for group ${subgroup}: ${subcommand}`
            );
        }
      }
      case MsgLogSubGroup.Ignore: {
        switch (subcommand) {
          case MsgLogCommandName.Channel:
            return this.ignoreChannelHandler(ctx, interaction, options);
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
            return this.unignoreChannelHandler(ctx, interaction, options);
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
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const channel = options.getChannel(MsgLogOptionName.Channel);
    if (!channel) {
      throw new Error("missing channel");
    }

    await ctx.sushiiAPI.sdk.updateGuildConfig({
      id: interaction.guild_id,
      patch: {
        logMsg: channel.id,
        logMsgEnabled: true,
      },
    });

    await ctx.REST.interactionReply(interaction, {
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
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const channel = options.getChannel(MsgLogOptionName.Channel);
    if (!channel) {
      throw new Error("missing channel");
    }

    const blockType = options.getString(MsgLogOptionName.BlockType);

    await ctx.sushiiAPI.sdk.upsertMsgLogBlock({
      guildId: interaction.guild_id,
      channelId: channel.id,
      blockType: blockType as MsgLogBlockType,
    });

    await ctx.REST.interactionReply(interaction, {
      embeds: [
        new EmbedBuilder()
          .setTitle("Message log updated")
          .setDescription(`<#${channel.id}>`)
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }

  async ignoreListHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction
  ): Promise<void> {
    const ignoredChannels = await ctx.sushiiAPI.sdk.getMsgLogBlocks({
      guildId: interaction.guild_id,
    });

    const ignoredChannelsStr =
      ignoredChannels.allMsgLogBlocks?.nodes
        .map((c) => `<#${c.channelId}>`)
        .join("\n") || "No channels are ignored";

    await ctx.REST.interactionReply(interaction, {
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
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const channel = options.getChannel(MsgLogOptionName.Channel);
    if (!channel) {
      throw new Error("missing channel");
    }

    await ctx.sushiiAPI.sdk.deleteMsgLogBlock({
      channelId: channel.id,
      guildId: interaction.guild_id,
    });

    await ctx.REST.interactionReply(interaction, {
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