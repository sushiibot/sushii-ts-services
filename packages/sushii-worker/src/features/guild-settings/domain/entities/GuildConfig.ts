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
      // Join and leave messages are enabled by default
      {
        joinMessage: null,
        joinMessageEnabled: true,
        leaveMessage: null,
        leaveMessageEnabled: true,
        messageChannel: null,
      },
      // Default logging are all enabled
      {
        modLogChannel: null,
        modLogEnabled: true,
        memberLogChannel: null,
        memberLogEnabled: true,
        messageLogChannel: null,
        messageLogEnabled: true,
      },
      {
        muteDmText: null,
        muteDmEnabled: true,
        warnDmText: null,
        warnDmEnabled: true,

        // Lookup flags
        lookupDetailsOptIn: false,
        lookupPrompted: false,
      },
      [],
    );
  }

  updateJoinMessage(message: string): GuildConfig {
    const config = this.clone();
    if (message === "") {
      // Should not be empty string
      config.messageSettings.leaveMessage = null;
      return config;
    }

    config.messageSettings.joinMessage = message;
    return config;
  }

  updateLeaveMessage(message: string): GuildConfig {
    const config = this.clone();
    if (message === "") {
      // Should not be empty string
      config.messageSettings.leaveMessage = null;
      return config;
    }

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
