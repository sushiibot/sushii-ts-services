import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  StringSelectMenuBuilder,
  TextDisplayBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

import SushiiEmoji from "@/shared/presentation/SushiiEmoji";

import { SETTINGS_CUSTOM_IDS, SettingsPage } from "./SettingsConstants";

export function createFooter(disabled = false): TextDisplayBuilder {
  let footerContent: string;

  if (disabled) {
    footerContent = "-# Inputs expired, re-run command to make changes.";
  } else {
    footerContent =
      "-# Inputs expire in 2 minutes of inactivity. Changes are saved automatically.";
  }

  return new TextDisplayBuilder().setContent(footerContent);
}

export function createNavigationRow(
  currentPage: SettingsPage,
  disabled = false,
): ActionRowBuilder<StringSelectMenuBuilder> {
  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(SETTINGS_CUSTOM_IDS.NAVIGATION)
      .setPlaceholder("Select settings category")
      .setDisabled(disabled)
      .addOptions([
        {
          label: "Logging & Moderation",
          value: "logging",
          description: "Configure server logs and moderation settings",
          default: currentPage === "logging",
        },
        {
          label: "Messages & Notifications",
          value: "messages",
          description: "Set up join/leave messages and channels",
          default: currentPage === "messages",
        },
        {
          label: "Advanced Settings",
          value: "advanced",
          description: "Additional server configuration options",
          default: currentPage === "advanced",
        },
      ]),
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
  const toggle = enabled ? SushiiEmoji.ToggleOn : SushiiEmoji.ToggleOff;
  const content = message ? `"${message}"` : "No message set";
  return `${toggle} **${name}**\n╰ ${content}\n╰ ${description}`;
}

export function formatToggleSetting(
  name: string,
  enabled: boolean,
  description: string,
): string {
  const toggle = enabled ? SushiiEmoji.ToggleOn : SushiiEmoji.ToggleOff;
  return `${toggle} **${name}**\n╰ ${description}`;
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