export interface MessageSettings {
  joinMessage: string | null;
  joinMessageEnabled: boolean;
  leaveMessage: string | null;
  leaveMessageEnabled: boolean;
  messageChannel: string | null;
}

export interface LoggingSettings {
  modLogChannel: string | null;
  modLogEnabled: boolean;
  memberLogChannel: string | null;
  memberLogEnabled: boolean;
  messageLogChannel: string | null;
  messageLogEnabled: boolean;
}

export interface ModerationSettings {
  muteDmText: string | null;
  muteDmEnabled: boolean;
  warnDmText: string | null;
  warnDmEnabled: boolean;
  lookupDetailsOptIn: boolean;
  lookupPrompted: boolean;
}

export type ToggleableSetting =
  | "joinMessage"
  | "leaveMessage"
  | "modLog"
  | "memberLog"
  | "messageLog"
  | "lookupOptIn";

export class GuildConfig {
  constructor(
    public readonly guildId: string,
    public readonly prefix: string | null,
    public readonly messageSettings: MessageSettings,
    public readonly loggingSettings: LoggingSettings,
    public readonly moderationSettings: ModerationSettings,
    public readonly disabledChannels: string[],
  ) {}

  clone(): GuildConfig {
    return new GuildConfig(
      this.guildId,
      this.prefix,
      { ...this.messageSettings },
      { ...this.loggingSettings },
      { ...this.moderationSettings },
      [...this.disabledChannels],
    );
  }

  static createDefault(guildId: string): GuildConfig {
    return new GuildConfig(
      guildId,
      null,
      {
        joinMessage: null,
        joinMessageEnabled: false,
        leaveMessage: null,
        leaveMessageEnabled: false,
        messageChannel: null,
      },
      {
        modLogChannel: null,
        modLogEnabled: false,
        memberLogChannel: null,
        memberLogEnabled: false,
        messageLogChannel: null,
        messageLogEnabled: false,
      },
      {
        muteDmText: null,
        muteDmEnabled: false,
        warnDmText: null,
        warnDmEnabled: false,
        lookupDetailsOptIn: false,
        lookupPrompted: false,
      },
      [],
    );
  }

  updateJoinMessage(message: string): GuildConfig {
    const config = this.clone();
    config.messageSettings.joinMessage = message;
    return config;
  }

  updateLeaveMessage(message: string): GuildConfig {
    const config = this.clone();
    config.messageSettings.leaveMessage = message;
    return config;
  }

  updateMessageChannel(channelId: string): GuildConfig {
    const config = this.clone();
    config.messageSettings.messageChannel = channelId;
    return config;
  }

  toggleJoinMessage(): GuildConfig {
    const config = this.clone();
    config.messageSettings.joinMessageEnabled =
      !config.messageSettings.joinMessageEnabled;
    return config;
  }

  toggleLeaveMessage(): GuildConfig {
    const config = this.clone();
    config.messageSettings.leaveMessageEnabled =
      !config.messageSettings.leaveMessageEnabled;
    return config;
  }

  updateLogChannel(
    type: "mod" | "member" | "message",
    channelId: string,
  ): GuildConfig {
    const config = this.clone();

    switch (type) {
      case "mod":
        config.loggingSettings.modLogChannel = channelId;
        break;
      case "member":
        config.loggingSettings.memberLogChannel = channelId;
        break;
      case "message":
        config.loggingSettings.messageLogChannel = channelId;
        break;
    }

    return config;
  }

  toggleLogging(type: "mod" | "member" | "message"): GuildConfig {
    const config = this.clone();

    switch (type) {
      case "mod":
        config.loggingSettings.modLogEnabled =
          !config.loggingSettings.modLogEnabled;
        break;
      case "member":
        config.loggingSettings.memberLogEnabled =
          !config.loggingSettings.memberLogEnabled;
        break;
      case "message":
        config.loggingSettings.messageLogEnabled =
          !config.loggingSettings.messageLogEnabled;
        break;
    }

    return config;
  }

  toggleModLog(): GuildConfig {
    const config = this.clone();
    config.loggingSettings.modLogEnabled =
      !config.loggingSettings.modLogEnabled;
    return config;
  }

  toggleMemberLog(): GuildConfig {
    const config = this.clone();
    config.loggingSettings.memberLogEnabled =
      !config.loggingSettings.memberLogEnabled;
    return config;
  }

  toggleMessageLog(): GuildConfig {
    const config = this.clone();
    config.loggingSettings.messageLogEnabled =
      !config.loggingSettings.messageLogEnabled;
    return config;
  }

  toggleLookupOptIn(): GuildConfig {
    const config = this.clone();
    config.moderationSettings.lookupDetailsOptIn =
      !config.moderationSettings.lookupDetailsOptIn;
    return config;
  }
}
