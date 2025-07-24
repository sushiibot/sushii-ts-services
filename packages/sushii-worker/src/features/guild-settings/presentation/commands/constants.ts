import { ChannelType } from "discord.js";
import { ToggleableSetting } from "../../domain/entities/GuildConfig";

export enum BaseCommandName {
  List = "list",
  JoinMessage = "joinmsg",
  LeaveMessage = "leavemsg",
  JoinLeaveChannel = "joinleavechannel",
  ModLog = "modlog",
  MemberLog = "memberlog",
  Lookup = "lookup",
}

export enum SubcommandGroupName {
  MessageLog = "msglog",
}

export enum MsgLogCommandName {
  SetChannel = "set_channel",
  Channel = "channel",
  IgnoreList = "ignorelist",
  Ignore = "ignore",
  Unignore = "unignore",
}

export enum OptionName {
  Message = "message",
  Channel = "channel",
  BlockType = "ignore_type",
}

export enum LogType {
  Mod = "mod",
  Member = "member",
  Message = "message",
}

export enum LookupCustomId {
  OptIn = "opt-in",
  OptOut = "opt-out",
}

export enum SettingFieldName {
  JoinMessageEnabled = "join_msg_enabled",
  LeaveMessageEnabled = "leave_msg_enabled",
  ModLogEnabled = "log_mod_enabled",
  MemberLogEnabled = "log_member_enabled",
  MessageLogEnabled = "log_msg_enabled",
}

export const SETTING_FIELD_MAPPING: Record<SettingFieldName, ToggleableSetting> = {
  [SettingFieldName.JoinMessageEnabled]: "joinMessage",
  [SettingFieldName.LeaveMessageEnabled]: "leaveMessage",
  [SettingFieldName.ModLogEnabled]: "modLog",
  [SettingFieldName.MemberLogEnabled]: "memberLog",
  [SettingFieldName.MessageLogEnabled]: "messageLog",
};

export const ALLOWED_CHANNEL_TYPES = [
  ChannelType.GuildText,
  ChannelType.GuildAnnouncement,
] as const;

export const COLLECTOR_TIMEOUT = 60000;
export const BUTTON_REJECTION_DELAY = 2500;