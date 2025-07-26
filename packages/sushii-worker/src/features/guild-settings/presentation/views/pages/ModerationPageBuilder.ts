import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
} from "discord.js";

import { MODERATION_DM_DEFAULTS } from "../../../domain/constants/ModerationDefaults";
import {
  createToggleButton,
  formatMessageSetting,
  formatToggleSetting,
} from "../components/SettingsComponents";
import {
  SETTINGS_CUSTOM_IDS,
  SettingsMessageOptions,
} from "../components/SettingsConstants";

export function addModerationContent(
  container: ContainerBuilder,
  options: SettingsMessageOptions,
): void {
  const { config, disabled = false } = options;

  // Header
  const headerText = new TextDisplayBuilder().setContent(
    "## Moderation Settings",
  );
  container.addTextDisplayComponents(headerText);

  // Lookup Settings Section
  let moderationContent = "### Lookup Settings\n";
  moderationContent +=
    "With the lookup command, you can see bans from other servers. ";
  moderationContent +=
    "You can either keep your server name and ban reasons private, or share them with other servers. ";
  moderationContent +=
    "In order to see the server name and ban reasons from other servers, you must also share your server name and ban reasons.\n\n";

  moderationContent += formatToggleSetting(
    "Lookup Data Sharing",
    config.moderationSettings.lookupDetailsOptIn,
    config.moderationSettings.lookupDetailsOptIn
      ? "Sharing server name, ban reasons with other servers"
      : "Only sharing ban timestamps (server name & reasons hidden)",
  );

  const moderationText = new TextDisplayBuilder().setContent(moderationContent);
  container.addTextDisplayComponents(moderationText);

  // Lookup Toggle Button
  const lookupRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    createToggleButton(
      config.moderationSettings.lookupDetailsOptIn,
      "Lookup Data Sharing",
      SETTINGS_CUSTOM_IDS.TOGGLE_LOOKUP_OPT_IN,
      disabled,
    ),
  );
  container.addActionRowComponents(lookupRow);
  container.addSeparatorComponents(
    new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large),
  );

  // DM Settings Section
  let dmContent = "\n### DM Settings\n";
  dmContent +=
    "Configure when DMs are sent to users for moderation actions and customize the message.";
  dmContent +=
    "\n**Note**: You can always override these settings by using the dm_reason option when using moderation commands.";
  dmContent += "\n\n";

  // Timeout DM Settings
  dmContent += formatToggleSetting(
    "⏳ Timeout Command DM",
    config.moderationSettings.timeoutCommandDmEnabled,
    "DM the user when they are timed out with the `/timeout` command",
  );
  dmContent += "\n";

  dmContent += formatToggleSetting(
    "⏳ Timeout Native DM",
    config.moderationSettings.timeoutNativeDmEnabled,
    "DM the user when they are timed out with Discord's native timeout",
  );

  const timeoutToggleText = new TextDisplayBuilder().setContent(dmContent);
  container.addTextDisplayComponents(timeoutToggleText);

  // Timeout toggle buttons
  const timeoutToggleRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    createToggleButton(
      config.moderationSettings.timeoutCommandDmEnabled,
      "Timeout Command DM",
      SETTINGS_CUSTOM_IDS.TOGGLE_TIMEOUT_COMMAND_DM,
      disabled,
    ),
    createToggleButton(
      config.moderationSettings.timeoutNativeDmEnabled,
      "Timeout Native DM",
      SETTINGS_CUSTOM_IDS.TOGGLE_TIMEOUT_NATIVE_DM,
      disabled,
    ),
  );
  container.addActionRowComponents(timeoutToggleRow);

  let timeoutMessageContent = "";
  timeoutMessageContent += formatMessageSetting(
    "⏳ Timeout DM Message",
    config.moderationSettings.timeoutDmText,
    "Custom timeout DM message (along with the reason)",
    MODERATION_DM_DEFAULTS.TIMEOUT_DM_TEXT,
  );

  const timeoutMessageText = new TextDisplayBuilder().setContent(
    timeoutMessageContent,
  );
  container.addTextDisplayComponents(timeoutMessageText);
  container.addSeparatorComponents(new SeparatorBuilder());

  const timeoutTextRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(SETTINGS_CUSTOM_IDS.EDIT_TIMEOUT_DM_TEXT)
      .setLabel("Edit Timeout DM Message")
      .setEmoji("📝")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabled),
  );
  container.addActionRowComponents(timeoutTextRow);

  container.addSeparatorComponents(
    new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large),
  );

  // Warn DM Settings
  let warnContent = "";
  warnContent += formatMessageSetting(
    "⚠️ Warn DM Message",
    config.moderationSettings.warnDmText,
    "Custom warning DM message (along with the reason)",
    MODERATION_DM_DEFAULTS.WARN_DM_TEXT,
  );

  const dmText2 = new TextDisplayBuilder().setContent(warnContent);
  container.addTextDisplayComponents(dmText2);

  // Warn button
  const warnTextRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(SETTINGS_CUSTOM_IDS.EDIT_WARN_DM_TEXT)
      .setLabel("Edit Warn DM Message")
      .setEmoji("📝")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabled),
  );
  container.addActionRowComponents(warnTextRow);

  container.addSeparatorComponents(
    new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large),
  );

  // Ban DM Settings
  let banToggleContent = "";
  banToggleContent += formatToggleSetting(
    "🔨 Ban DM",
    config.moderationSettings.banDmEnabled,
    "DM the user when banned. Note that this will ONLY work if you use the `/ban` command, not Discord's native ban action as bots cannot DM users that are no longer in the server.",
  );

  const banToggleText = new TextDisplayBuilder().setContent(banToggleContent);
  container.addTextDisplayComponents(banToggleText);
  container.addSeparatorComponents(new SeparatorBuilder());

  // Ban DM toggle button
  const banToggleRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    createToggleButton(
      config.moderationSettings.banDmEnabled,
      "Ban DM",
      SETTINGS_CUSTOM_IDS.TOGGLE_BAN_DM,
      disabled,
    ),
  );
  container.addActionRowComponents(banToggleRow);

  let banMessageContent = "";
  banMessageContent += formatMessageSetting(
    "🔨 Ban DM Message",
    config.moderationSettings.banDmText,
    "Custom ban DM message (along with the reason)",
    MODERATION_DM_DEFAULTS.BAN_DM_TEXT,
  );

  const banMessageText = new TextDisplayBuilder().setContent(banMessageContent);
  container.addTextDisplayComponents(banMessageText);

  const banTextRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(SETTINGS_CUSTOM_IDS.EDIT_BAN_DM_TEXT)
      .setLabel("Edit Ban DM Text")
      .setEmoji("📝")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabled),
  );
  container.addActionRowComponents(banTextRow);
}
