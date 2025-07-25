import {
  ActionRowBuilder,
  ButtonBuilder,
  ChannelSelectMenuBuilder,
  ChannelType,
  ContainerBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
} from "discord.js";

import {
  createToggleButton,
  formatLogSetting,
} from "../components/SettingsComponents";
import {
  SETTINGS_CUSTOM_IDS,
  SettingsMessageOptions,
} from "../components/SettingsConstants";

export function addLoggingContent(
  container: ContainerBuilder,
  options: SettingsMessageOptions,
): void {
  const { config, disabled = false } = options;

  // Header
  const headerText = new TextDisplayBuilder().setContent("## Logging Settings");
  container.addTextDisplayComponents(headerText);

  // Logging Section
  let loggingContent = "### Logs\n";
  loggingContent += "Track moderation, member, and message activity.\n\n";

  loggingContent += formatLogSetting(
    "Mod Logs",
    config.loggingSettings.modLogChannel,
    config.loggingSettings.modLogEnabled,
    "Logs moderation actions like bans, kicks, warnings",
  );
  loggingContent += "\n";
  loggingContent += formatLogSetting(
    "Member Logs",
    config.loggingSettings.memberLogChannel,
    config.loggingSettings.memberLogEnabled,
    "Logs member joins, leaves, role changes",
  );
  loggingContent += "\n";
  loggingContent += formatLogSetting(
    "Message Logs",
    config.loggingSettings.messageLogChannel,
    config.loggingSettings.messageLogEnabled,
    "Logs message edits and deletions",
  );

  const loggingText = new TextDisplayBuilder().setContent(loggingContent);
  container.addTextDisplayComponents(loggingText);

  // Channel Selection Row
  const modLogChannelSelectRow =
    new ActionRowBuilder<ChannelSelectMenuBuilder>();

  const modLogSelect = new ChannelSelectMenuBuilder()
    .setCustomId(SETTINGS_CUSTOM_IDS.SET_MOD_LOG_CHANNEL)
    .setPlaceholder("Set mod log channel")
    .setDefaultChannels(
      config.loggingSettings.modLogChannel
        ? [config.loggingSettings.modLogChannel]
        : [],
    )
    .setMaxValues(1)
    .setMinValues(0)
    .setChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
    .setDisabled(disabled);

  // We'll rotate through different selects or use a consolidated approach
  modLogChannelSelectRow.addComponents(modLogSelect);
  container.addActionRowComponents(modLogChannelSelectRow);

  const memberLogSelect = new ChannelSelectMenuBuilder()
    .setCustomId(SETTINGS_CUSTOM_IDS.SET_MEMBER_LOG_CHANNEL)
    .setPlaceholder("Set member log channel")
    .setDefaultChannels(
      config.loggingSettings.memberLogChannel
        ? [config.loggingSettings.memberLogChannel]
        : [],
    )
    .setChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
    .setDisabled(disabled);

  const memberLogChannelSelectRow =
    new ActionRowBuilder<ChannelSelectMenuBuilder>();
  memberLogChannelSelectRow.addComponents(memberLogSelect);
  container.addActionRowComponents(memberLogChannelSelectRow);

  const messageLogSelect = new ChannelSelectMenuBuilder()
    .setCustomId(SETTINGS_CUSTOM_IDS.SET_MESSAGE_LOG_CHANNEL)
    .setPlaceholder("Set message log channel")
    .setDefaultChannels(
      config.loggingSettings.messageLogChannel
        ? [config.loggingSettings.messageLogChannel]
        : [],
    )
    .setChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
    .setDisabled(disabled);

  const messageLogChannelSelectRow =
    new ActionRowBuilder<ChannelSelectMenuBuilder>();
  messageLogChannelSelectRow.addComponents(messageLogSelect);
  container.addActionRowComponents(messageLogChannelSelectRow);

  // Toggle Buttons Row
  const toggleRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    createToggleButton(
      config.loggingSettings.modLogEnabled,
      "Mod Logs",
      SETTINGS_CUSTOM_IDS.TOGGLE_MOD_LOG,
      disabled,
    ),
    createToggleButton(
      config.loggingSettings.memberLogEnabled,
      "Member Logs",
      SETTINGS_CUSTOM_IDS.TOGGLE_MEMBER_LOG,
      disabled,
    ),
    createToggleButton(
      config.loggingSettings.messageLogEnabled,
      "Message Logs",
      SETTINGS_CUSTOM_IDS.TOGGLE_MESSAGE_LOG,
      disabled,
    ),
  );
  container.addActionRowComponents(toggleRow);

  // Separator
  container.addSeparatorComponents(
    new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large),
  );

  let msgLogContent = "### Message Log Ignored Channels\n";
  msgLogContent += "Some channels being too noisy in your message logs?\n";
  msgLogContent +=
    "You can ignore channels you don't want to show up in your message logs.\n\n";

  if (options.messageLogBlocks && options.messageLogBlocks.length > 0) {
    msgLogContent += options.messageLogBlocks
      .map((block) => `<#${block.channelId}>`)
      .join("\n");
  } else {
    msgLogContent += "No channels are currently ignored for message logs.";
  }

  const msgLogText = new TextDisplayBuilder().setContent(msgLogContent);
  container.addTextDisplayComponents(msgLogText);

  // Multi-select channel menu for managing ignored channels
  const ignoredChannelIds =
    options.messageLogBlocks?.map((block) => block.channelId) || [];

  const msgLogChannelSelectRow =
    new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId(SETTINGS_CUSTOM_IDS.MESSAGE_LOG_IGNORE_CHANNELS)
        .setPlaceholder("Select channels to ignore for message logs")
        .setChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setMinValues(0)
        .setMaxValues(25) // Discord's limit
        .setDefaultChannels(ignoredChannelIds)
        .setDisabled(disabled),
    );
  container.addActionRowComponents(msgLogChannelSelectRow);
}
