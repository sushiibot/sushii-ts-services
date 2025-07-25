import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextDisplayBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

import { SETTINGS_CUSTOM_IDS, SettingsPage } from "./SettingsConstants";

export function createFooter(disabled = false): TextDisplayBuilder {
  let footerContent: string;

  if (disabled) {
    footerContent =
      "-# Inputs expired after 2 minutes of inactivity, re-run command to make changes.";
  } else {
    footerContent =
      "-# Inputs expire in 2 minutes of inactivity. Changes are saved automatically.";
  }

  return new TextDisplayBuilder().setContent(footerContent);
}

export function createNavigationRow(
  currentPage: SettingsPage,
  disabled = false,
): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(SETTINGS_CUSTOM_IDS.NAVIGATION_LOGGING)
      .setLabel("Logging")
      .setStyle(
        currentPage === "logging" ? ButtonStyle.Primary : ButtonStyle.Secondary,
      )
      .setDisabled(currentPage === "logging" || disabled),
    new ButtonBuilder()
      .setCustomId(SETTINGS_CUSTOM_IDS.NAVIGATION_MODERATION)
      .setLabel("Moderation")
      .setStyle(
        currentPage === "moderation"
          ? ButtonStyle.Primary
          : ButtonStyle.Secondary,
      )
      .setDisabled(currentPage === "moderation" || disabled),
    new ButtonBuilder()
      .setCustomId(SETTINGS_CUSTOM_IDS.NAVIGATION_MESSAGES)
      .setLabel("Messages")
      .setStyle(
        currentPage === "messages"
          ? ButtonStyle.Primary
          : ButtonStyle.Secondary,
      )
      .setDisabled(currentPage === "messages" || disabled),
    new ButtonBuilder()
      .setCustomId(SETTINGS_CUSTOM_IDS.NAVIGATION_ADVANCED)
      .setLabel("Advanced")
      .setStyle(
        currentPage === "advanced"
          ? ButtonStyle.Primary
          : ButtonStyle.Secondary,
      )
      .setDisabled(currentPage === "advanced" || disabled),
  );
}

export function formatLogSetting(
  name: string,
  channelId: string | null,
  enabled: boolean,
  description: string,
): string {
  const toggle = enabled ? "`[ON ]`" : "`[OFF]`";
  const channel = channelId ? `<#${channelId}>` : "No channel set";

  let text = `${toggle} **${name}** — ${channel}\n`;
  text += `> ${description}\n`;

  return text;
}

export function formatMessageSetting(
  name: string,
  message: string | null,
  enabled: boolean,
  description: string,
): string {
  let s = `**${name}**: `;
  s += enabled ? "`Enabled`" : "`Disabled`";
  s += `\n> ${description}`;

  s += `\n\`\`\``;
  s += `\n${message ? message : "No message set"}`;
  s += `\n\`\`\`\n`;

  return s;
}

export function formatToggleSetting(
  name: string,
  enabled: boolean,
  description: string,
): string {
  let s = `**${name}**: `;
  s += enabled ? "`Enabled`" : "`Disabled`";
  s += `\n> ${description}`;

  return s;
}

export function createToggleButton(
  currentlyEnabled: boolean,
  name: string,
  customId: string,
  disabled = false,
): ButtonBuilder {
  const action = currentlyEnabled ? "Disable" : "Enable";

  return new ButtonBuilder()
    .setCustomId(customId)
    .setLabel(`${action} ${name}`)
    .setStyle(currentlyEnabled ? ButtonStyle.Secondary : ButtonStyle.Success)
    .setDisabled(disabled);
}

export function createJoinMessageModal(
  currentMessage: string | null,
): ModalBuilder {
  const modal = new ModalBuilder()
    .setCustomId(SETTINGS_CUSTOM_IDS.EDIT_JOIN_MESSAGE)
    .setTitle("Edit Join Message");

  const messageInput = new TextInputBuilder()
    .setCustomId("join_message_input")
    .setLabel("Join Message")
    .setStyle(TextInputStyle.Paragraph)
    .setValue(currentMessage || "")
    .setPlaceholder(
      "Welcome <username> to <server>! You are member #<member_number>",
    )
    .setRequired(true)
    .setMaxLength(1000);

  if (currentMessage) {
    messageInput.setValue(currentMessage);
  }

  const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
    messageInput,
  );
  modal.addComponents(actionRow);

  return modal;
}

export function createLeaveMessageModal(
  currentMessage: string | null,
): ModalBuilder {
  const modal = new ModalBuilder()
    .setCustomId(SETTINGS_CUSTOM_IDS.EDIT_LEAVE_MESSAGE)
    .setTitle("Edit Leave Message");

  const messageInput = new TextInputBuilder()
    .setCustomId("leave_message_input")
    .setLabel("Leave Message")
    .setStyle(TextInputStyle.Paragraph)
    .setValue(currentMessage || "")
    .setPlaceholder("<username> has left <server>")
    .setRequired(true)
    .setMaxLength(1000);

  if (currentMessage) {
    messageInput.setValue(currentMessage);
  }

  const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
    messageInput,
  );
  modal.addComponents(actionRow);

  return modal;
}
