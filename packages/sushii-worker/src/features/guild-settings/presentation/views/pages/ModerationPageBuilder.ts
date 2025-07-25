import {
  ActionRowBuilder,
  ButtonBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
} from "discord.js";

import {
  createToggleButton,
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
}
