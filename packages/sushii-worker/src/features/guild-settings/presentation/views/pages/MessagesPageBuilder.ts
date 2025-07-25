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

  // Join/Leave Messages Section Header
  let headerContent = "### Join/Leave Messages";
  headerContent += "\n";
  headerContent +=
    "Send custom messages when members join or leave the server.\n\n";

  // Current Channel Display
  if (config.messageSettings.messageChannel) {
    headerContent += `**Channel:** <#${config.messageSettings.messageChannel}>`;
  } else {
    headerContent += "**Channel:** No channel set";
  }

  headerContent += `\n> The channel join and leave messages will be sent to.`;

  const headerText2 = new TextDisplayBuilder().setContent(headerContent);
  container.addTextDisplayComponents(headerText2);

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

  // Join Message Section
  const joinMessageContent = formatMessageSetting(
    "Join Message",
    config.messageSettings.joinMessage,
    config.messageSettings.joinMessageEnabled,
    "Message sent when new members join",
  );
  const joinMessageText = new TextDisplayBuilder().setContent(
    joinMessageContent,
  );
  container.addTextDisplayComponents(joinMessageText);

  // Join Message Controls
  const joinControlsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(SETTINGS_CUSTOM_IDS.EDIT_JOIN_MESSAGE)
      .setLabel("Edit Join Message")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disabled),
    createToggleButton(
      config.messageSettings.joinMessageEnabled,
      "Join Messages",
      SETTINGS_CUSTOM_IDS.TOGGLE_JOIN_MSG,
      disabled,
    ),
  );
  container.addActionRowComponents(joinControlsRow);

  // Leave Message Section
  const leaveMessageContent = formatMessageSetting(
    "Leave Message",
    config.messageSettings.leaveMessage,
    config.messageSettings.leaveMessageEnabled,
    "Message sent when members leave",
  );
  const leaveMessageText = new TextDisplayBuilder().setContent(
    leaveMessageContent,
  );
  container.addTextDisplayComponents(leaveMessageText);

  // Leave Message Controls
  const leaveControlsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(SETTINGS_CUSTOM_IDS.EDIT_LEAVE_MESSAGE)
      .setLabel("Edit Leave Message")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disabled),
    createToggleButton(
      config.messageSettings.leaveMessageEnabled,
      "Leave Messages",
      SETTINGS_CUSTOM_IDS.TOGGLE_LEAVE_MSG,
      disabled,
    ),
  );
  container.addActionRowComponents(leaveControlsRow);
}
