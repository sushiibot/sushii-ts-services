import { GuildConfig } from "@/features/guild-settings/domain/entities/GuildConfig";
import { MessageLogBlock } from "@/features/guild-settings/domain/entities/MessageLogBlock";

export type SettingsPage = "logging" | "moderation" | "messages" | "advanced";

export interface SettingsMessageOptions {
  page: SettingsPage;
  config: GuildConfig;
  messageLogBlocks?: MessageLogBlock[];
  disabled?: boolean;
}

export const SETTINGS_CUSTOM_IDS = {
  NAVIGATION: "settings_nav",
  NAVIGATION_LOGGING: "settings_nav_logging",
  NAVIGATION_MODERATION: "settings_nav_moderation",
  NAVIGATION_MESSAGES: "settings_nav_messages",
  NAVIGATION_ADVANCED: "settings_nav_advanced",
  TOGGLE_MOD_LOG: "settings_toggle_mod_log",
  TOGGLE_MEMBER_LOG: "settings_toggle_member_log",
  TOGGLE_MESSAGE_LOG: "settings_toggle_message_log",
  TOGGLE_JOIN_MSG: "settings_toggle_join_msg",
  TOGGLE_LEAVE_MSG: "settings_toggle_leave_msg",
  TOGGLE_LOOKUP_OPT_IN: "settings_toggle_lookup_opt_in",
  SET_MOD_LOG_CHANNEL: "settings_set_mod_log_channel",
  SET_MEMBER_LOG_CHANNEL: "settings_set_member_log_channel",
  SET_MESSAGE_LOG_CHANNEL: "settings_set_message_log_channel",
  SET_JOIN_LEAVE_CHANNEL: "settings_set_join_leave_channel",
  EDIT_JOIN_MESSAGE: "settings_edit_join_message",
  EDIT_LEAVE_MESSAGE: "settings_edit_leave_message",
  MESSAGE_LOG_IGNORE_CHANNELS: "settings_msglog_ignore_channels",
} as const;
