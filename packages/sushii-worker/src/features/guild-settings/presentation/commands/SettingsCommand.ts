import { sleep } from "bun";
import {
  ChatInputCommandInteraction,
  ComponentType,
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { Logger } from "pino";

import customIds from "@/interactions/customIds";
import { SlashCommandHandler } from "@/interactions/handlers";

import { GuildSettingsService } from "../../application/GuildSettingsService";
import { MessageLogService } from "../../application/MessageLogService";
import { MessageLogBlockType } from "../../domain/entities/MessageLogBlock";
import {
  formatIgnoredChannelsEmbed,
  formatLookupComponents,
  formatLookupEmbed,
  formatSettingsComponents,
  formatSettingsEmbed,
  formatJoinMessageSuccessEmbed,
  formatLeaveMessageSuccessEmbed,
  formatChannelSetSuccessEmbed,
  formatIgnoreChannelSuccessEmbed,
  formatUnignoreChannelSuccessEmbed,
  formatButtonRejectionResponse,
} from "../views/GuildSettingsView";
import {
  ALLOWED_CHANNEL_TYPES,
  BUTTON_REJECTION_DELAY,
  BaseCommandName,
  COLLECTOR_TIMEOUT,
  LogType,
  LookupCustomId,
  MsgLogCommandName,
  OptionName,
  SETTING_FIELD_MAPPING,
  SettingFieldName,
  SubcommandGroupName,
} from "./constants";

const blockTypes: Record<string, MessageLogBlockType> = {
  all: "all",
  edits: "edits",
  deletes: "deletes",
};

export default class SettingsCommand extends SlashCommandHandler {
  constructor(
    private readonly guildSettingsService: GuildSettingsService,
    private readonly messageLogService: MessageLogService,
    private readonly logger: Logger,
  ) {
    super();
  }

  command = new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Configure sushii server settings.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setContexts(InteractionContextType.Guild)
    .addSubcommand((c) =>
      c.setName(BaseCommandName.List).setDescription("Show the current server settings."),
    )
    .addSubcommand((c) =>
      c
        .setName(BaseCommandName.JoinMessage)
        .setDescription("Set the message for new members.")
        .addStringOption((o) =>
          o
            .setName(OptionName.Message)
            .setDescription(
              "You can use <username>, <mention>, <server>, <member_number>",
            )
            .setRequired(true),
        ),
    )
    .addSubcommand((c) =>
      c
        .setName(BaseCommandName.LeaveMessage)
        .setDescription("Set the message for members leaving.")
        .addStringOption((o) =>
          o
            .setName(OptionName.Message)
            .setDescription("You can use <username>, <mention>, <server>")
            .setRequired(true),
        ),
    )
    .addSubcommand((c) =>
      c
        .setName(BaseCommandName.JoinLeaveChannel)
        .setDescription("Set channel to send join/leave messages to.")
        .addChannelOption((o) =>
          o
            .setName(OptionName.Channel)
            .setDescription("Where to send the messages.")
            .addChannelTypes(...ALLOWED_CHANNEL_TYPES)
            .setRequired(true),
        ),
    )
    .addSubcommand((c) =>
      c
        .setName(BaseCommandName.ModLog)
        .setDescription("Set channel for mod logs.")
        .addChannelOption((o) =>
          o
            .setName(OptionName.Channel)
            .setDescription("Where to send mod logs to.")
            .addChannelTypes(...ALLOWED_CHANNEL_TYPES)
            .setRequired(true),
        ),
    )
    .addSubcommand((c) =>
      c
        .setName(BaseCommandName.MemberLog)
        .setDescription("Set channel for member logs.")
        .addChannelOption((o) =>
          o
            .setName(OptionName.Channel)
            .setDescription("Where to send member logs to.")
            .addChannelTypes(...ALLOWED_CHANNEL_TYPES)
            .setRequired(true),
        ),
    )
    .addSubcommandGroup((g) =>
      g
        .setName(SubcommandGroupName.MessageLog)
        .setDescription("Modify message log settings.")
        .addSubcommand((c) =>
          c
            .setName(MsgLogCommandName.SetChannel)
            .setDescription("Set the channel for message logs.")
            .addChannelOption((o) =>
              o
                .setName(OptionName.Channel)
                .setDescription("Channel to send message logs to.")
                .addChannelTypes(...ALLOWED_CHANNEL_TYPES)
                .setRequired(true),
            ),
        )
        .addSubcommand((c) =>
          c
            .setName(MsgLogCommandName.Ignore)
            .setDescription("Ignore a channel for deleted and edited message.")
            .addChannelOption((o) =>
              o
                .setName(OptionName.Channel)
                .setDescription("Channel to ignore.")
                .setRequired(true),
            )
            .addStringOption((o) =>
              o
                .setName(OptionName.BlockType)
                .setDescription(
                  "What type of logs to ignore? By default all logs will be ignored.",
                )
                .addChoices(
                  { name: "Edits", value: blockTypes.edits },
                  { name: "Deletes", value: blockTypes.deletes },
                  { name: "All", value: blockTypes.all },
                ),
            ),
        )
        .addSubcommand((c) =>
          c
            .setName(MsgLogCommandName.IgnoreList)
            .setDescription("List channels that are ignored."),
        )
        .addSubcommand((c) =>
          c
            .setName(MsgLogCommandName.Unignore)
            .setDescription("Re-enable message logs for an ignored channel.")
            .addChannelOption((o) =>
              o
                .setName(OptionName.Channel)
                .setDescription("Channel to un-ignore.")
                .setRequired(true),
            ),
        ),
    )
    .addSubcommand((c) =>
      c.setName(BaseCommandName.Lookup).setDescription("Modify lookup settings."),
    )
    .toJSON();

  async handler(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Guild not cached.");
    }

    const subgroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    switch (subgroup) {
      case SubcommandGroupName.MessageLog:
        return this.handleMsgLogCommands(interaction, subcommand);
      case null:
        return this.handleBaseCommands(interaction, subcommand);
      default:
        throw new Error("Invalid subcommand.");
    }
  }

  private async handleMsgLogCommands(
    interaction: ChatInputCommandInteraction<"cached">,
    subcommand: string,
  ): Promise<void> {
    switch (subcommand) {
      case MsgLogCommandName.SetChannel:
        return this.msgLogSetHandler(interaction);
      case MsgLogCommandName.Ignore:
        return this.msgLogIgnoreHandler(interaction);
      case MsgLogCommandName.IgnoreList:
        return this.msgLogIgnoreListHandler(interaction);
      case MsgLogCommandName.Unignore:
        return this.msgLogUnignoreHandler(interaction);
      default:
        throw new Error("Invalid msglog subcommand.");
    }
  }

  private async handleBaseCommands(
    interaction: ChatInputCommandInteraction<"cached">,
    subcommand: string,
  ): Promise<void> {
    switch (subcommand) {
      case BaseCommandName.List:
        return this.listHandler(interaction);
      case BaseCommandName.JoinMessage:
        return this.joinMsgHandler(interaction);
      case BaseCommandName.LeaveMessage:
        return this.leaveMsgHandler(interaction);
      case BaseCommandName.JoinLeaveChannel:
        return this.joinLeaveChannelHandler(interaction);
      case BaseCommandName.ModLog:
      case BaseCommandName.MemberLog:
        return this.logChannelHandler(interaction);
      case BaseCommandName.Lookup:
        return this.lookupHandler(interaction);
      default:
        throw new Error("Invalid subcommand.");
    }
  }

  private async listHandler(
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const config = await this.guildSettingsService.getGuildSettings(
      interaction.guildId,
    );

    const embed = formatSettingsEmbed(config);
    const components = formatSettingsComponents(config);

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
      try {
        if (i.user.id !== interaction.user.id) {
          const replied = await i.reply(formatButtonRejectionResponse());

          // Does not block other interactions
          await sleep(2500);
          await replied.delete();

          return;
        }

        const match = customIds.settingsToggleButton.match(i.customId);
        if (!match) {
          throw new Error("Invalid custom ID.");
        }

        const { field } = match.params;
        if (!field) {
          throw new Error(`Invalid custom ID: ${i.customId}`);
        }

        const setting = SETTING_FIELD_MAPPING[field as SettingFieldName];
        if (!setting) {
          throw new Error(`Unknown setting field: ${field}`);
        }

        const newConfig = await this.guildSettingsService.toggleSetting(
          interaction.guildId,
          setting,
        );

        const newEmbed = formatSettingsEmbed(newConfig);
        const newComponents = formatSettingsComponents(newConfig);

        await i.update({
          embeds: [newEmbed],
          components: newComponents,
        });
      } catch (err) {
        this.logger.error(err, "Failed to update settings collector.");
      }
    });

    collector.on("end", async () => {
      try {
        await msg.edit({ components: [] });
      } catch (err) {
        this.logger.error(err, "Failed to end settings list collector.");
      }
    });
  }

  private async joinMsgHandler(
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const message = interaction.options.getString(OptionName.Message, true);

    await this.guildSettingsService.updateJoinMessage(
      interaction.guildId,
      message,
    );

    const embed = formatJoinMessageSuccessEmbed(message);

    await interaction.reply({ embeds: [embed] });
  }

  private async leaveMsgHandler(
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const message = interaction.options.getString(OptionName.Message, true);

    await this.guildSettingsService.updateLeaveMessage(
      interaction.guildId,
      message,
    );

    const embed = formatLeaveMessageSuccessEmbed(message);

    await interaction.reply({ embeds: [embed] });
  }

  private async joinLeaveChannelHandler(
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const channel = interaction.options.getChannel(OptionName.Channel, true);

    await this.guildSettingsService.updateMessageChannel(
      interaction.guildId,
      channel.id,
    );

    const embed = formatChannelSetSuccessEmbed(channel.id, "join/leave");

    await interaction.reply({ embeds: [embed] });
  }

  private async logChannelHandler(
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const subcommand = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel(OptionName.Channel, true);

    let logType: LogType;
    let channelType: "mod log" | "member log";

    switch (subcommand) {
      case BaseCommandName.ModLog:
        logType = LogType.Mod;
        channelType = "mod log";
        break;
      case BaseCommandName.MemberLog:
        logType = LogType.Member;
        channelType = "member log";
        break;
      default:
        throw new Error("Invalid subcommand.");
    }

    await this.guildSettingsService.updateLogChannel(
      interaction.guildId,
      logType,
      channel.id,
    );

    const embed = formatChannelSetSuccessEmbed(channel.id, channelType);

    await interaction.reply({ embeds: [embed] });
  }

  private async lookupHandler(
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    let config = await this.guildSettingsService.getGuildSettings(
      interaction.guildId,
    );

    const embed = formatLookupEmbed(config);
    const components = formatLookupComponents(
      config.moderationSettings.lookupDetailsOptIn,
    );

    const msg = await interaction.reply({
      embeds: [embed],
      components,
    });

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: COLLECTOR_TIMEOUT,
      dispose: true,
    });

    collector.on("collect", async (i) => {
      try {
        if (i.user.id !== interaction.user.id) {
          const replied = await i.reply(formatButtonRejectionResponse());

          await sleep(BUTTON_REJECTION_DELAY);
          await replied.delete();

          return;
        }

        const isValidCustomId =
          i.customId === LookupCustomId.OptIn ||
          i.customId === LookupCustomId.OptOut;
        if (!isValidCustomId) {
          throw new Error("Invalid custom ID.");
        }

        config = await this.guildSettingsService.toggleSetting(
          interaction.guildId,
          "lookupOptIn",
        );

        const newEmbed = formatLookupEmbed(config);
        const newComponents = formatLookupComponents(
          config.moderationSettings.lookupDetailsOptIn,
        );

        await i.update({
          embeds: [newEmbed],
          components: newComponents,
        });
      } catch (err) {
        this.logger.error(err, "Failed to update settings lookup collector.");
      }
    });

    collector.on("end", async () => {
      try {
        const newComponents = formatLookupComponents(
          config.moderationSettings.lookupDetailsOptIn,
          true,
        );

        await msg.edit({ components: newComponents });
      } catch (err) {
        this.logger.error(err, "Failed to end settings lookup collector.");
      }
    });
  }

  private async msgLogSetHandler(
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const channel = interaction.options.getChannel(OptionName.Channel, true);

    await this.guildSettingsService.updateLogChannel(
      interaction.guildId,
      LogType.Message,
      channel.id,
    );

    const embed = formatChannelSetSuccessEmbed(channel.id, "message log");

    await interaction.reply({ embeds: [embed] });
  }

  private async msgLogIgnoreHandler(
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const channel = interaction.options.getChannel(OptionName.Channel, true);
    const blockType = (interaction.options.getString(OptionName.BlockType) ||
      blockTypes.all) as MessageLogBlockType;

    if (!Object.values(blockTypes).includes(blockType)) {
      throw new Error("Invalid block type.");
    }

    await this.messageLogService.addIgnoredChannel(
      interaction.guildId,
      channel.id,
      blockType,
    );

    const embed = formatIgnoreChannelSuccessEmbed(channel.id, blockType);

    await interaction.reply({ embeds: [embed] });
  }

  private async msgLogIgnoreListHandler(
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const blocks = await this.messageLogService.getIgnoredChannels(
      interaction.guildId,
    );
    const embed = formatIgnoredChannelsEmbed(blocks);
    await interaction.reply({ embeds: [embed] });
  }

  private async msgLogUnignoreHandler(
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const channel = interaction.options.getChannel(OptionName.Channel, true);

    await this.messageLogService.removeIgnoredChannel(
      interaction.guildId,
      channel.id,
    );

    const embed = formatUnignoreChannelSuccessEmbed(channel.id);

    await interaction.reply({ embeds: [embed] });
  }
}
