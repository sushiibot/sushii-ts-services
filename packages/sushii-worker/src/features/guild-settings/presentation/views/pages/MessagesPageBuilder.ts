import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelSelectMenuBuilder,
  ChannelType,
  ContainerBuilder,
  TextDisplayBuilder,
} from "discord.js";

import {
  createToggleButton,
  formatMessageSetting,
} from "../components/SettingsComponents";
import {
  SETTINGS_CUSTOM_IDS,
  SettingsMessageOptions,
} from "../components/SettingsConstants";

export function addMessagesContent(
  container: ContainerBuilder,
  options: SettingsMessageOptions,
): void {
  const { config, disabled = false } = options;

  // Header
  const headerText = new TextDisplayBuilder().setContent(
    "## Messages & Notifications Settings",
  );
  container.addTextDisplayComponents(headerText);

  // Join/Leave Messages Section
  let messagesContent = "### Join/Leave Messages";
  messagesContent += "\n";
  messagesContent +=
    "Send custom messages when members join or leave the server.\n\n";

  messagesContent += formatMessageSetting(
    "Join Message",
    config.messageSettings.joinMessage,
    config.messageSettings.joinMessageEnabled,
    "Message sent when new members join",
  );
  messagesContent += "\n";
  messagesContent += formatMessageSetting(
    "Leave Message",
    config.messageSettings.leaveMessage,
    config.messageSettings.leaveMessageEnabled,
    "Message sent when members leave",
  );
  messagesContent += "\n\n";

  if (config.messageSettings.messageChannel) {
    messagesContent += `**Channel:** <#${config.messageSettings.messageChannel}>\n`;
  } else {
    messagesContent += "**Channel:** No channel set";
  }

  const messagesText = new TextDisplayBuilder().setContent(messagesContent);
  container.addTextDisplayComponents(messagesText);

  // Channel Selection
  const channelRow =
    new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId(SETTINGS_CUSTOM_IDS.SET_JOIN_LEAVE_CHANNEL)
        .setPlaceholder("Set join/leave messages channel")
        .setChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setDisabled(disabled),
    );
  container.addActionRowComponents(channelRow);

  // Message Edit Buttons
  const editRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(SETTINGS_CUSTOM_IDS.EDIT_JOIN_MESSAGE)
      .setLabel("Edit Join Message")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disabled),
    new ButtonBuilder()
      .setCustomId(SETTINGS_CUSTOM_IDS.EDIT_LEAVE_MESSAGE)
      .setLabel("Edit Leave Message")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disabled),
  );
  container.addActionRowComponents(editRow);

  // Toggle Buttons
  const toggleRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    createToggleButton(
      config.messageSettings.joinMessageEnabled,
      "Join Messages",
      SETTINGS_CUSTOM_IDS.TOGGLE_JOIN_MSG,
      disabled,
    ),
    createToggleButton(
      config.messageSettings.leaveMessageEnabled,
      "Leave Messages",
      SETTINGS_CUSTOM_IDS.TOGGLE_LEAVE_MSG,
      disabled,
    ),
  );
  container.addActionRowComponents(toggleRow);
}
