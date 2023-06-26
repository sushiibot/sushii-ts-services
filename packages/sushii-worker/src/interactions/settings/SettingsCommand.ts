import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  MessageFlags,
  ChannelType,
} from "discord.js";
import { AllSelection } from "kysely/dist/cjs/parser/select-parser";
import Context from "../../model/context";
import { SlashCommandHandler } from "../handlers";
import db from "../../model/db";
import SushiiEmoji from "../../constants/SushiiEmoji";
import { DB, AppPublicMsgLogBlockType } from "../../model/dbTypes";
import Color from "../../utils/colors";
import customIds, { SettingsToggleOptions } from "../customIds";
import logger from "../../logger";

export enum MsgLogCommandName {
  SetChannel = "set_channel",
  Channel = "channel",

  IgnoreList = "ignorelist",
  Ignore = "ignore",
  Unignore = "unignore",
}

export enum MsgLogOptionName {
  Channel = "channel",
  BlockType = "ignore_type",
}

const blockTypes: Record<string, AppPublicMsgLogBlockType> = {
  all: "all",
  edits: "edits",
  deletes: "deletes",
};

function blockTypeToString(type: AppPublicMsgLogBlockType): string {
  switch (type) {
    case "all":
      return "edits and deletes";
    case "deletes":
      return "deletes only";
    case "edits":
      return "edits only";
  }
}

function toToggleButton(enabled?: boolean): string {
  return enabled ? SushiiEmoji.ToggleOn : SushiiEmoji.ToggleOff;
}

function formatTextOption(
  name: string,
  text: string | null,
  missingText: string,
  enabled?: boolean
): string {
  let s = "";
  s += toToggleButton(enabled);
  s += ` \`${name}\`\n`;
  s += `╰ ${text || missingText}`;
  s += "\n";

  return s;
}

function formatChannelOption(
  name: string,
  channel: string | null,
  missingText: string,
  enabled?: boolean
): string {
  let s = "";
  s += toToggleButton(enabled);
  s += ` \`${name}\`\n`;
  s += "╰ ";

  if (channel) {
    s += `<#${channel}>`;
  } else {
    s += missingText;
  }

  return s;
}

function getGuildConfigEmbed(
  ctx: Context,
  config: AllSelection<DB, "app_public.guild_configs">
): EmbedBuilder {
  let embed = new EmbedBuilder()
    .setTitle("Server Settings")
    .setColor(Color.Info);

  let general = "";

  general += `\`Prefix\`: \`${config.prefix || "-"}\``;
  general += "\n";
  general +=
    "╰ **Note:** Commands are being migrated to slash commands, this is only for legacy commands that have not been migrated yet.";

  embed = embed.addFields([
    {
      name: "General",
      value: general,
      inline: false,
    },
  ]);

  // ---------------------------------------------------------------------------
  // Join / Leave messages

  let joinLeave = "";

  joinLeave += formatTextOption(
    "Join Message",
    config.join_msg,
    `No join message set, use ${ctx.getCommandMention(
      "settings joinmsg"
    )} to set one.`,
    config.join_msg_enabled
  );

  joinLeave += formatTextOption(
    "Leave Message",
    config.leave_msg,
    `No leave message set, use ${ctx.getCommandMention(
      "settings leavemsg"
    )} to set one.`,
    config.leave_msg_enabled
  );
  joinLeave += "\n";

  if (config.msg_channel) {
    joinLeave += `Join/Leave messages will be sent to <#${config.msg_channel}>`;
  } else {
    joinLeave += `⚠️ Join/Leave message channel needs to be set with ${ctx.getCommandMention(
      "settings joinleavechannel"
    )}`;
  }

  embed = embed.addFields([
    {
      name: "Join/Leave Messages",
      value: joinLeave,
      inline: false,
    },
  ]);

  // ---------------------------------------------------------------------------
  // Logging

  let logging = "";

  logging += formatChannelOption(
    "Mod logs",
    config.log_mod,
    `No mod log channel set, use ${ctx.getCommandMention("settings modlog")}`,
    config.log_mod_enabled
  );
  logging += "\n";

  logging += formatChannelOption(
    "Member join/leave logs",
    config.log_member,
    `No member log channel set, use ${ctx.getCommandMention(
      "settings memberlog"
    )}`,
    config.log_member_enabled
  );
  logging += "\n";

  logging += formatChannelOption(
    "Message logs",
    config.log_msg,
    `No message log channel set, use ${ctx.getCommandMention(
      "settings msglog set_channel"
    )}`,
    config.log_msg_enabled
  );
  logging += "\n";

  embed = embed.addFields([
    {
      name: "Logging",
      value: logging,
      inline: false,
    },
  ]);

  // ---------------------------------------------------------------------------
  // Lookup

  let lookup = "";

  lookup += toToggleButton(config.lookup_details_opt_in);

  const stateText = config.lookup_details_opt_in ? "opted-in" : "opted-out";

  lookup += ` Lookup details currently ${stateText}, use ${ctx.getCommandMention(
    "settings lookup"
  )} to see additional details and modify this setting.`;

  embed = embed.addFields([
    {
      name: "Lookup",
      value: lookup,
    },
  ]);

  return embed;
}

function getToggleButton(
  currentlyEnabled: boolean,
  name: string,
  field: SettingsToggleOptions
): ButtonBuilder {
  const actionName = currentlyEnabled ? "Disable" : "Enable";

  return new ButtonBuilder()
    .setStyle(currentlyEnabled ? ButtonStyle.Secondary : ButtonStyle.Success)
    .setLabel(`${actionName} ${name}`)
    .setCustomId(
      customIds.settingsToggleButton.compile({
        field,
        // If currently enabled, disable
        newState: currentlyEnabled ? "disable" : "enable",
      })
    );
}

function getSettingsComponents(
  config: AllSelection<DB, "app_public.guild_configs">
): ActionRowBuilder<ButtonBuilder>[] {
  const joinLeaveButtons = new ActionRowBuilder<ButtonBuilder>().addComponents([
    getToggleButton(
      config.join_msg_enabled,
      "join message",
      "join_msg_enabled"
    ),
    getToggleButton(
      config.leave_msg_enabled,
      "leave message",
      "leave_msg_enabled"
    ),
  ]);

  const moderationButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    [
      getToggleButton(config.log_mod_enabled, "mod logs", "log_mod_enabled"),
      getToggleButton(
        config.log_member_enabled,
        "member logs",
        "log_member_enabled"
      ),
      getToggleButton(
        config.log_msg_enabled,
        "message logs",
        "log_msg_enabled"
      ),
    ]
  );

  return [joinLeaveButtons, moderationButtons];
}

export default class SettingsCommand extends SlashCommandHandler {
  command = new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Configure sushii server settings.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addSubcommand((c) =>
      c.setName("view").setDescription("View the current server settings.")
    )
    .addSubcommand((c) =>
      c
        .setName("joinmsg")
        .setDescription("Set the message for new members.")
        .addStringOption((o) =>
          o
            .setName("message")
            .setDescription(
              "You can use <username>, <mention>, <server>, <member_number>"
            )
            .setRequired(true)
        )
    )
    .addSubcommand((c) =>
      c
        .setName("leavemsg")
        .setDescription("Set the message for members leaving.")
        .addStringOption((o) =>
          o
            .setName("message")
            .setDescription("You can use <username>, <mention>, <server>")
            .setRequired(true)
        )
    )
    .addSubcommand((c) =>
      c
        .setName("joinleavechannel")
        .setDescription("Set channel to send join/leave messages to.")
        .addChannelOption((o) =>
          o
            .setName("channel")
            .setDescription("Where to send the messages.")
            .addChannelTypes(
              ChannelType.GuildText,
              ChannelType.GuildAnnouncement
            )
            .setRequired(true)
        )
    )
    .addSubcommand((c) =>
      c
        .setName("modlog")
        .setDescription("Set channel for mod logs.")
        .addChannelOption((o) =>
          o
            .setName("channel")
            .setDescription("Where to send mod logs to.")
            .addChannelTypes(
              ChannelType.GuildText,
              ChannelType.GuildAnnouncement
            )
            .setRequired(true)
        )
    )
    .addSubcommand((c) =>
      c
        .setName("memberlog")
        .setDescription("Set channel for member logs.")
        .addChannelOption((o) =>
          o
            .setName("channel")
            .setDescription("Where to send member logs to.")
            .addChannelTypes(
              ChannelType.GuildText,
              ChannelType.GuildAnnouncement
            )
            .setRequired(true)
        )
    )
    // /settings messagelog
    .addSubcommandGroup((g) =>
      g
        .setName("msglog")
        .setDescription("Modify message log settings.")
        // settings messagelog setchannel
        .addSubcommand((c) =>
          c
            .setName(MsgLogCommandName.SetChannel)
            .setDescription("Set the channel for message logs.")
            .addChannelOption((o) =>
              o
                .setName(MsgLogOptionName.Channel)
                .setDescription("Channel to send message logs to.")
                .addChannelTypes(
                  ChannelType.GuildText,
                  ChannelType.GuildAnnouncement
                )
                .setRequired(true)
            )
        )
        // settings messagelog ignore
        .addSubcommand((c) =>
          c
            .setName(MsgLogCommandName.Ignore)
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
                .setDescription(
                  "What type of logs to ignore? By default all logs will be ignored."
                )
                .addChoices(
                  {
                    name: "Edits",
                    value: blockTypes.edits,
                  },
                  {
                    name: "Deletes",
                    value: blockTypes.deletes,
                  },
                  {
                    name: "All",
                    value: blockTypes.all,
                  }
                )
            )
        )
        // settings messagelog ignorelist
        .addSubcommand((c) =>
          c
            .setName(MsgLogCommandName.IgnoreList)
            .setDescription("List channels that are ignored.")
        )
        // settings messagelog unignore
        .addSubcommand((c) =>
          c
            .setName(MsgLogCommandName.Unignore)
            .setDescription("Re-enable message logs for an ignored channel.")
            .addChannelOption((o) =>
              o
                .setName(MsgLogOptionName.Channel)
                .setDescription("Channel to un-ignore.")
                .setRequired(true)
            )
        )
    )
    .addSubcommand((c) =>
      c.setName("lookup").setDescription("Modify lookup settings.")
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Guild not cached.");
    }

    const subgroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    switch (subgroup) {
      case "msglog": {
        switch (subcommand) {
          case MsgLogCommandName.SetChannel:
            return this.msgLogSetHandler(ctx, interaction);
          case MsgLogCommandName.Ignore:
            return this.msgLogIgnoreHandler(ctx, interaction);
          case MsgLogCommandName.IgnoreList:
            return this.msgLogIgnoreListHandler(ctx, interaction);
          case MsgLogCommandName.Unignore:
            return this.msgLogUnignoreHandler(ctx, interaction);
          default:
            throw new Error("Invalid subcommand.");
        }
      }
      // Base commands
      case null: {
        switch (subcommand) {
          case "view":
            return SettingsCommand.viewHandler(ctx, interaction);
          case "joinmsg":
            return SettingsCommand.joinMsgHandler(ctx, interaction);
          case "leavemsg":
            return SettingsCommand.leaveMsgHandler(ctx, interaction);
          case "joinleavechannel":
            return SettingsCommand.joinLeaveChannelHandler(ctx, interaction);
          case "modlog":
          case "memberlog":
          case "messagelog":
            return SettingsCommand.logChannelHandler(ctx, interaction);
          case "lookup":
            return SettingsCommand.lookupHandler(ctx, interaction);
          default:
            throw new Error("Invalid subcommand.");
        }
      }
      default:
        throw new Error("Invalid subcommand.");
    }
  }

  static async viewHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const config = await db.getGuildConfig(interaction.guildId);

    if (!config) {
      throw new Error("No config found.");
    }

    const embed = getGuildConfigEmbed(ctx, config);
    const components = getSettingsComponents(config);

    const msg = await interaction.reply({
      embeds: [embed.toJSON()],
      components,
    });

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000,
      dispose: true,
    });

    collector.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id) {
        const replied = await i.reply({
          content: "These buttons aren't for you! 😡",
          ephemeral: true,
        });

        setTimeout(() => {
          // Discard error
          replied.delete().catch(() => {});
        }, 2500);

        return;
      }

      const match = customIds.settingsToggleButton.match(i.customId);
      if (!match) {
        throw new Error("Invalid custom ID.");
      }

      const { field, newState } = match.params;

      if (!field || !newState) {
        throw new Error(`Invalid custom ID: ${i.customId}`);
      }

      const newConfig = await db
        .updateTable("app_public.guild_configs")
        .where("app_public.guild_configs.id", "=", interaction.guildId)
        .set({
          // Assumes field is correct, only enforced by typescript, convert string to boolean
          [field]: newState === "enable",
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      logger.debug(newConfig, "compiled query");

      const newEmbed = getGuildConfigEmbed(ctx, newConfig);
      const newComponents = getSettingsComponents(newConfig);

      await msg.edit({
        embeds: [newEmbed],
        components: newComponents,
      });

      const actionStr = newState === "enable" ? "Enabled" : "Disabled";

      const buttonPressConfirmMessage = await i.reply({
        content: `${actionStr} now!`,
        flags: MessageFlags.Ephemeral,
      });

      // Delete this button response after 2.5 seconds -- only if there isn't another button press
      setTimeout(() => {
        // Discard error
        buttonPressConfirmMessage?.delete().catch(() => {});
      }, 2000);
    });

    collector.on("end", async (collected) => {
      logger.debug(`Collected ${collected.size} interactions.`);

      // Remove buttons so they can't be clicked again
      await msg.edit({
        components: [],
      });
    });
  }

  static async joinMsgHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const message = interaction.options.getString("message", true);

    await db.updateGuildConfig(interaction.guildId, {
      join_msg: message,
    });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Join message set!")
          .setDescription(message.replace("\\n", "\n"))
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }

  static async leaveMsgHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const message = interaction.options.getString("message", true);

    await db.updateGuildConfig(interaction.guildId, {
      leave_msg: message,
    });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Leave message set!")
          .setDescription(message.replace("\\n", "\n"))
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }

  static async joinLeaveChannelHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const channel = interaction.options.getChannel("channel", true);

    await db.updateGuildConfig(interaction.guildId, {
      msg_channel: channel.id,
    });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Join/Leave channel set!")
          .setDescription(
            `Join/Leave messages will be sent to <#${channel.id}>`
          )
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }

  static async logChannelHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const subcommand = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel("channel", true);

    let patch = {};
    let message = "";

    switch (subcommand) {
      case "modlog":
        patch = {
          log_mod: channel.id,
        };
        message = "Mod log channel set!";

        break;
      case "memberlog":
        patch = {
          log_member: channel.id,
        };
        message = "Member log channel set!";

        break;
      case "messagelog":
        patch = {
          log_msg: channel.id,
        };
        message = "Message log channel set!";

        break;
      default:
        throw new Error("Invalid subcommand.");
    }

    await db.updateGuildConfig(interaction.guildId, patch);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(message)
          .setDescription(`Log messages will be sent to <#${channel.id}>`)
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }

  static getLookupHandlerEmbed(
    config: AllSelection<DB, "app_public.guild_configs">
  ): EmbedBuilder {
    let description = toToggleButton(config.lookup_details_opt_in);

    if (config.lookup_details_opt_in) {
      description += " This server is currently opted in!";
      description += "\n";
      description += "**Info shared with with other opted-in servers:**\n";
      description += "╰ Server name, server ID, reason, and timestamp.";

      description += "\n\n";
      description += "**Info viewable from other opted-in servers:**\n";
      description += "╰ Server name, server ID, reason, and timestamp.";

      description += "\n\n";
      description += "Want to hide your server name and ban reasons?";
      description += "\n";
      description +=
        "Opt-out of sharing with the button below. Note that this will prevent you from seeing other server names and ban reasons as well.";
    } else {
      description += " This server is currently opted out.";
      description += "\n";
      description += "**Info shared with other servers:**\n";
      description += "╰ Ban timestamp";

      description += "\n\n";
      description += "**Info viewable from other servers:**\n";
      description += "╰ Ban timestamp";

      description += "\n\n";
      description += "Want to see the names of other servers and ban reasons?";
      description += "\n";
      description +=
        "Opt-in to sharing your server name and ban reasons with the button below.";
    }

    return new EmbedBuilder()
      .setTitle("Lookup Settings")
      .setDescription(description)
      .setColor(Color.Info);
  }

  static getLookupHandlerComponents(
    currentlyOptedIn: boolean,
    disabled: boolean = false
  ): ActionRowBuilder<ButtonBuilder>[] {
    let button;
    if (disabled) {
      const labelAction = currentlyOptedIn ? "opt-out" : "opt-in";

      button = new ButtonBuilder()
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary)
        .setLabel(`Expired, run this command again to ${labelAction}`)
        .setCustomId("meow");
    } else {
      button = new ButtonBuilder()
        .setStyle(currentlyOptedIn ? ButtonStyle.Danger : ButtonStyle.Success)
        .setLabel(currentlyOptedIn ? "Opt-out of sharing" : "Opt-in to sharing")
        .setCustomId(currentlyOptedIn ? "opt-out" : "opt-in");
    }

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    return [row];
  }

  static async lookupHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    let config = await db.getGuildConfig(interaction.guildId);
    const embed = SettingsCommand.getLookupHandlerEmbed(config);
    const components = SettingsCommand.getLookupHandlerComponents(
      config.lookup_details_opt_in
    );

    const msg = await interaction.reply({
      embeds: [embed],
      components,
    });

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000,
      dispose: true,
    });

    collector.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id) {
        const replied = await i.reply({
          content: "These buttons aren't for you! 😡",
          ephemeral: true,
        });

        setTimeout(() => {
          // Discard error
          replied.delete().catch(() => {});
        }, 2500);

        return;
      }

      const match = i.customId === "opt-in" || i.customId === "opt-out";
      if (!match) {
        throw new Error("Invalid custom ID.");
      }

      const newOptedInState = i.customId === "opt-in";

      config = await db.updateGuildConfig(interaction.guildId, {
        lookup_details_opt_in: newOptedInState,
      });

      const newEmbed = SettingsCommand.getLookupHandlerEmbed(config);
      const newComponents = SettingsCommand.getLookupHandlerComponents(
        config.lookup_details_opt_in
      );

      await msg.edit({
        embeds: [newEmbed],
        components: newComponents,
      });

      const buttonPressConfirmMessage = await i.reply({
        content: newOptedInState ? "Opted in now!" : "Opted out now!",
        flags: MessageFlags.Ephemeral,
      });

      // Delete this button response after 2.5 seconds
      setTimeout(() => {
        // Discard error
        buttonPressConfirmMessage?.delete().catch(() => {});
      }, 2500);
    });

    collector.on("end", async (collected) => {
      logger.debug(`Collected ${collected.size} interactions.`);

      const newComponents = SettingsCommand.getLookupHandlerComponents(
        config.lookup_details_opt_in,
        true
      );

      // Remove buttons so they can't be clicked again
      await msg.edit({
        components: newComponents,
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Message logs

  async msgLogSetHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const channel = interaction.options.getChannel(
      MsgLogOptionName.Channel,
      true
    );

    await db.updateGuildConfig(interaction.guildId, {
      log_msg: channel.id,
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

  async msgLogIgnoreHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const channel = interaction.options.getChannel(
      MsgLogOptionName.Channel,
      true
    );

    const blockType =
      interaction.options.getString(MsgLogOptionName.BlockType) ||
      blockTypes.all;

    if (
      blockTypes.all !== blockType &&
      blockTypes.deletes !== blockType &&
      blockTypes.edits !== blockType
    ) {
      throw new Error("Invalid block type.");
    }

    await db
      .insertInto("app_public.msg_log_blocks")
      .values({
        guild_id: interaction.guildId,
        channel_id: channel.id,
        block_type: blockType,
      })
      .onConflict((oc) =>
        oc.columns(["guild_id", "channel_id"]).doUpdateSet({
          block_type: blockType,
        })
      )
      .execute();

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Added new message log ignore")
          .setDescription(
            `ignoring ${blockTypeToString(blockType)} in <#${channel.id}>`
          )
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }

  async msgLogIgnoreListHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const ignoredChannels = await db
      .selectFrom("app_public.msg_log_blocks")
      .selectAll()
      .where("guild_id", "=", interaction.guildId)
      .execute();

    const ignoredChannelsStr =
      ignoredChannels
        .map((c) => `<#${c.channel_id}> - ${blockTypeToString(c.block_type)}`)
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

  async msgLogUnignoreHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const channel = interaction.options.getChannel(
      MsgLogOptionName.Channel,
      true
    );

    await db
      .deleteFrom("app_public.msg_log_blocks")
      .where("guild_id", "=", interaction.guildId)
      .where("channel_id", "=", channel.id)
      .execute();

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
