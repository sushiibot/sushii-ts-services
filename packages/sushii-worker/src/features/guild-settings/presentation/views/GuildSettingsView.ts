import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { GuildConfig } from "../../domain/entities/GuildConfig";
import { MessageLogBlock } from "../../domain/entities/MessageLogBlock";
import Color from "@/utils/colors";
import SushiiEmoji from "@/shared/presentation/SushiiEmoji";
import customIds, { SettingsToggleOptions } from "@/interactions/customIds";

export function formatSettingsEmbed(config: GuildConfig): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle("Server Settings")
    .setColor(Color.Info);

  const general = `\`Prefix\`: \`${config.prefix || "-"}\`\n╰ **Note:** Commands are being migrated to slash commands, this is only for legacy commands that have not been migrated yet.`;

  const joinLeave = formatJoinLeaveSection(config);
  const logging = formatLoggingSection(config);
  const lookup = formatLookupSection(config);

  embed.addFields([
    { name: "General", value: general, inline: false },
    { name: "Join/Leave Messages", value: joinLeave, inline: false },
    { name: "Logging", value: logging, inline: false },
    { name: "Lookup", value: lookup, inline: false },
  ]);

  return embed;
}

export function formatSuccessEmbed(
  title: string,
  description: string,
): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(Color.Success);
}

export function formatIgnoredChannelsEmbed(
  blocks: MessageLogBlock[],
): EmbedBuilder {
  const description =
    blocks.length > 0
      ? blocks
          .map(
            (block) =>
              `<#${block.channelId}> - ${block.getBlockTypeDescription()}`,
          )
          .join("\n")
      : "No channels are ignored";

  return new EmbedBuilder()
    .setTitle("Ignored Channels - Message Log")
    .setDescription(description)
    .setFooter({
      text: "These channels won't show up in message logs for deleted and edited messages.",
    })
    .setColor(Color.Success);
}

export function formatLookupEmbed(config: GuildConfig): EmbedBuilder {
  let description = toToggleButton(
    config.moderationSettings.lookupDetailsOptIn,
  );

  if (config.moderationSettings.lookupDetailsOptIn) {
    description += " This server is currently opted in!\n";
    description += "**Info shared with with other opted-in servers:**\n";
    description += "╰ Server name, server ID, reason, and timestamp.\n\n";
    description += "**Info viewable from other opted-in servers:**\n";
    description += "╰ Server name, server ID, reason, and timestamp.\n\n";
    description += "Want to hide your server name and ban reasons?\n";
    description +=
      "Opt-out of sharing with the button below. Note that this will prevent you from seeing other server names and ban reasons as well.";
  } else {
    description += " This server is currently opted out.\n";
    description += "**Info shared with other servers:**\n";
    description += "╰ Ban timestamp\n\n";
    description += "**Info viewable from other servers:**\n";
    description += "╰ Ban timestamp\n\n";
    description += "Want to see the names of other servers and ban reasons?\n";
    description +=
      "Opt-in to sharing your server name and ban reasons with the button below.";
  }

  return new EmbedBuilder()
    .setTitle("Lookup Settings")
    .setDescription(description)
    .setColor(Color.Info);
}

export function formatSettingsComponents(
  config: GuildConfig,
): ActionRowBuilder<ButtonBuilder>[] {
  const joinLeaveButtons = new ActionRowBuilder<ButtonBuilder>().addComponents([
    getToggleButton(
      config.messageSettings.joinMessageEnabled,
      "join message",
      "join_msg_enabled",
    ),
    getToggleButton(
      config.messageSettings.leaveMessageEnabled,
      "leave message",
      "leave_msg_enabled",
    ),
  ]);

  const moderationButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    [
      getToggleButton(
        config.loggingSettings.modLogEnabled,
        "mod logs",
        "log_mod_enabled",
      ),
      getToggleButton(
        config.loggingSettings.memberLogEnabled,
        "member logs",
        "log_member_enabled",
      ),
      getToggleButton(
        config.loggingSettings.messageLogEnabled,
        "message logs",
        "log_msg_enabled",
      ),
    ],
  );

  return [joinLeaveButtons, moderationButtons];
}

export function formatLookupComponents(
  currentlyOptedIn: boolean,
  disabled: boolean = false,
): ActionRowBuilder<ButtonBuilder>[] {
  let button;
  if (disabled) {
    const labelAction = currentlyOptedIn ? "opt-out" : "opt-in";
    button = new ButtonBuilder()
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary)
      .setLabel(`Expired, run this command again to ${labelAction}`)
      .setCustomId("expired");
  } else {
    button = new ButtonBuilder()
      .setStyle(currentlyOptedIn ? ButtonStyle.Danger : ButtonStyle.Success)
      .setLabel(currentlyOptedIn ? "Opt-out of sharing" : "Opt-in to sharing")
      .setCustomId(currentlyOptedIn ? "opt-out" : "opt-in");
  }

  return [new ActionRowBuilder<ButtonBuilder>().addComponents(button)];
}

function formatJoinLeaveSection(config: GuildConfig): string {
  let section = "";

  section += formatTextOption(
    "Join Message",
    config.messageSettings.joinMessage,
    "No join message set, use `/settings joinmsg` to set one.",
    config.messageSettings.joinMessageEnabled,
  );

  section += formatTextOption(
    "Leave Message",
    config.messageSettings.leaveMessage,
    "No leave message set, use `/settings leavemsg` to set one.",
    config.messageSettings.leaveMessageEnabled,
  );

  section += "\n";

  if (config.messageSettings.messageChannel) {
    section += `Join/Leave messages will be sent to <#${config.messageSettings.messageChannel}>`;
  } else {
    section +=
      "⚠️ Join/Leave message channel needs to be set with `/settings joinleavechannel`";
  }

  return section;
}

function formatLoggingSection(config: GuildConfig): string {
  let section = "";

  section += formatChannelOption(
    "Mod logs",
    config.loggingSettings.modLogChannel,
    "No mod log channel set, use `/settings modlog`",
    config.loggingSettings.modLogEnabled,
  );
  section += "\n";

  section += formatChannelOption(
    "Member join/leave logs",
    config.loggingSettings.memberLogChannel,
    "No member log channel set, use `/settings memberlog`",
    config.loggingSettings.memberLogEnabled,
  );
  section += "\n";

  section += formatChannelOption(
    "Message logs",
    config.loggingSettings.messageLogChannel,
    "No message log channel set, use `/settings msglog set_channel`",
    config.loggingSettings.messageLogEnabled,
  );

  return section;
}

function formatLookupSection(config: GuildConfig): string {
  let section = toToggleButton(config.moderationSettings.lookupDetailsOptIn);
  const stateText = config.moderationSettings.lookupDetailsOptIn
    ? "opted-in"
    : "opted-out";
  section += ` Lookup details currently ${stateText}, use \`/settings lookup\` to see additional details and modify this setting.`;
  return section;
}

function formatTextOption(
  name: string,
  text: string | null,
  missingText: string,
  enabled?: boolean,
): string {
  let s = toToggleButton(enabled);
  s += ` \`${name}\`\n`;
  s += `╰ ${text || missingText}\n`;
  return s;
}

function formatChannelOption(
  name: string,
  channel: string | null,
  missingText: string,
  enabled?: boolean,
): string {
  let s = toToggleButton(enabled);
  s += ` \`${name}\`\n`;
  s += "╰ ";
  s += channel ? `<#${channel}>` : missingText;
  return s;
}

function toToggleButton(enabled?: boolean): string {
  return enabled ? SushiiEmoji.ToggleOn : SushiiEmoji.ToggleOff;
}

function getToggleButton(
  currentlyEnabled: boolean,
  name: string,
  field: SettingsToggleOptions,
): ButtonBuilder {
  const actionName = currentlyEnabled ? "Disable" : "Enable";

  return new ButtonBuilder()
    .setStyle(currentlyEnabled ? ButtonStyle.Secondary : ButtonStyle.Success)
    .setLabel(`${actionName} ${name}`)
    .setCustomId(
      customIds.settingsToggleButton.compile({
        field,
        newState: currentlyEnabled ? "disable" : "enable",
      }),
    );
}
