import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import {
  APIChatInputApplicationCommandGuildInteraction,
  PermissionFlagsBits,
} from "discord-api-types/v10";
import { BlockType } from "../../generated/graphql";
import Context from "../../model/context";
import Color from "../../utils/colors";
import {
  isNoValuesDeletedError,
  isUniqueViolation,
} from "../../utils/graphqlError";
import { SlashCommandHandler } from "../handlers";
import CommandInteractionOptionResolver from "../resolver";
import { interactionReplyErrorPlainMessage } from "../responses/error";

enum XpGroupName {
  Block = "block",
  Unblock = "unblock",
}

enum XpCommandName {
  BlockChannel = "channel",
  BlockRole = "role",
  BlockList = "list",

  UnblockChannel = "channel",
  UnblockRole = "role",
}

enum XpOption {
  Role = "role",
  AddLevel = "add_level",
  RemoveLevel = "remove_level",
  Channel = "channel",
}

export default class XpCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("xp")
    .setDescription("Configure xp options and level roles.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addSubcommandGroup((g) =>
      g
        .setName(XpGroupName.Block)
        .setDescription("Block channel or roles from gaining xp.")
        .addSubcommand((c) =>
          c
            .setName(XpCommandName.BlockChannel)
            .setDescription("Block a channel from gaining xp.")
            .addChannelOption((o) =>
              o
                .setName(XpOption.Channel)
                .setDescription("The channel to block.")
                .setRequired(true)
            )
        )
        .addSubcommand((c) =>
          c
            .setName(XpCommandName.BlockRole)
            .setDescription("Block a role from gaining xp.")
            .addRoleOption((o) =>
              o
                .setName(XpOption.Role)
                .setDescription("The role to block.")
                .setRequired(true)
            )
        )
        .addSubcommand((c) =>
          c
            .setName(XpCommandName.BlockList)
            .setDescription("List all blocked channels or roles.")
        )
    )
    .addSubcommandGroup((g) =>
      g
        .setName(XpGroupName.Unblock)
        .setDescription("Unblock channel or roles from gaining xp.")
        .addSubcommand((c) =>
          c
            .setName(XpCommandName.UnblockChannel)
            .setDescription("Unblock a channel from gaining xp.")
            .addChannelOption((o) =>
              o
                .setName(XpOption.Channel)
                .setDescription("The channel unblock.")
                .setRequired(true)
            )
        )
        .addSubcommand((c) =>
          c
            .setName(XpCommandName.UnblockRole)
            .setDescription("Unblock a role from gaining xp.")
            .addRoleOption((o) =>
              o
                .setName(XpOption.Role)
                .setDescription("The role to unblock.")
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
      case XpGroupName.Block:
        switch (subcommand) {
          case XpCommandName.BlockChannel:
            return this.blockChannelHandler(ctx, interaction, options);
          case XpCommandName.BlockRole:
            return this.blockRoleHandler(ctx, interaction, options);
          case XpCommandName.BlockList:
            return this.listBlocksHandler(ctx, interaction);
          default:
            throw new Error(
              `Invalid subcommand for group ${subgroup}: ${subcommand}`
            );
        }
      case XpGroupName.Unblock:
        switch (subcommand) {
          case XpCommandName.UnblockChannel:
            return this.unblockChannelHandler(ctx, interaction, options);
          case XpCommandName.UnblockRole:
            return this.unblockRoleHandler(ctx, interaction, options);
          default:
            throw new Error(
              `Invalid subcommand for group ${subgroup}: ${subcommand}`
            );
        }
      default:
        throw new Error("Invalid subgroup");
    }
  }

  private async blockChannelHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const channel = options.getChannel(XpOption.Channel);
    if (!channel) {
      throw new Error("Missing channel");
    }

    try {
      await ctx.sushiiAPI.sdk.addXpBlock({
        guildId: interaction.guild_id,
        blockId: channel.id,
        blockType: BlockType.Channel,
      });
    } catch (err) {
      if (!isUniqueViolation(err)) {
        throw err;
      }

      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        `Channel <#${channel.id}> is already blocked`,
        true
      );

      return;
    }

    await ctx.REST.interactionReply(interaction, {
      embeds: [
        new EmbedBuilder()
          .setTitle("Added XP block for channel")
          .setFields([
            {
              name: "Channel",
              value: `<#${channel.id}>`,
            },
          ])
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }

  private async blockRoleHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const role = options.getRole(XpOption.Role);
    if (!role) {
      throw new Error("Missing role");
    }

    try {
      await ctx.sushiiAPI.sdk.addXpBlock({
        guildId: interaction.guild_id,
        blockId: role.id,
        blockType: BlockType.Role,
      });
    } catch (err) {
      if (!isUniqueViolation(err)) {
        throw err;
      }

      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        `Role <@&${role.id}> is already blocked`,
        true
      );

      return;
    }

    await ctx.REST.interactionReply(interaction, {
      embeds: [
        new EmbedBuilder()
          .setTitle("Added XP block for role")
          .setFields([
            {
              name: "Role",
              value: `<@&${role.id}>`,
            },
          ])
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }

  private async listBlocksHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction
  ): Promise<void> {
    const { allXpBlocks } = await ctx.sushiiAPI.sdk.getXpBlocks({
      guildId: interaction.guild_id,
    });

    if (!allXpBlocks || allXpBlocks.nodes.length === 0) {
      await ctx.REST.interactionReply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setTitle("All XP blocks")
            .setDescription("There are no XP blocks")
            .setColor(Color.Success)
            .toJSON(),
        ],
      });

      return;
    }

    const channelBlocks = allXpBlocks.nodes
      .filter((node) => node.blockType === BlockType.Channel)
      .map((node) => `<#${node.blockId}>`);

    const roleBlocks = allXpBlocks.nodes
      .filter((node) => node.blockType === BlockType.Role)
      .map((node) => `<@&${node.blockId}>`);

    await ctx.REST.interactionReply(interaction, {
      embeds: [
        new EmbedBuilder()
          .setTitle("All XP blocks")
          .setFields([
            {
              name: "Channels",
              value: channelBlocks.join("\n") || "No channels are blocked",
              inline: false,
            },
            {
              name: "Roles",
              value: roleBlocks.join("\n") || "No roles are blocked",
              inline: false,
            },
          ])
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }

  private async unblockChannelHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const channel = options.getChannel(XpOption.Channel);
    if (!channel) {
      throw new Error("Missing channel");
    }

    try {
      await ctx.sushiiAPI.sdk.deleteXpBlock({
        guildId: interaction.guild_id,
        blockId: channel.id,
      });
    } catch (err) {
      if (!isNoValuesDeletedError(err)) {
        throw err;
      }

      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        `No XP block was found for <#${channel.id}>`,
        true
      );

      return;
    }

    await ctx.REST.interactionReply(interaction, {
      embeds: [
        new EmbedBuilder()
          .setTitle("Unblocked XP for channel")
          .setFields([
            {
              name: "Channel",
              value: `<#${channel.id}>`,
            },
          ])
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }

  private async unblockRoleHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const role = options.getRole(XpOption.Role);
    if (!role) {
      throw new Error("Missing role");
    }

    try {
      await ctx.sushiiAPI.sdk.deleteXpBlock({
        guildId: interaction.guild_id,
        blockId: role.id,
      });
    } catch (err) {
      if (!isNoValuesDeletedError(err)) {
        throw err;
      }

      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        `No XP block was found for <@&${role.id}>`,
        true
      );

      return;
    }

    await ctx.REST.interactionReply(interaction, {
      embeds: [
        new EmbedBuilder()
          .setTitle("Unblocked XP for role")
          .setFields([
            {
              name: "Role",
              value: `<@&${role.id}>`,
            },
          ])
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }
}
