import { RawFile, REST } from "@discordjs/rest";
import dayjs from "dayjs";
import {
  Routes,
  RESTPostAPIInteractionCallbackJSONBody,
  APIInteractionResponseCallbackData,
  InteractionResponseType,
  RESTGetAPIUserResult,
  RESTGetAPIGuildMemberResult,
  APIInteraction,
  RESTGetAPIGuildRolesResult,
  RESTGetAPIChannelMessageResult,
  RESTPatchAPIChannelMessageResult,
  RESTPatchAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessageResult,
  RESTPostAPIChannelMessageJSONBody,
} from "discord-api-types/v10";
import { ConfigI } from "./config";

export default class RESTClient {
  private rest: REST;

  constructor(private readonly config: ConfigI) {
    this.rest = new REST({
      version: "10",
      api: this.config.proxyUrl,
    }).setToken(config.token);
  }

  public async interactionReply(
    interaction: APIInteraction,
    msg: APIInteractionResponseCallbackData,
    files?: RawFile[]
  ): Promise<void> {
    return this.interactionCallback(
      interaction,
      {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: msg,
      },
      files
    );
  }

  /**
   * Edits the message the component was attached to
   *
   * @param interaction
   * @param msg
   * @returns
   */
  public async interactionEdit(
    interaction: APIInteraction,
    msg: APIInteractionResponseCallbackData
  ): Promise<void> {
    return this.interactionCallback(interaction, {
      type: InteractionResponseType.UpdateMessage,
      data: msg,
    });
  }

  public async interactionCallback(
    interaction: APIInteraction,
    payload: RESTPostAPIInteractionCallbackJSONBody,
    files?: RawFile[]
  ): Promise<void> {
    // TODO: Handle errors, determine response type
    await this.rest.post(
      Routes.interactionCallback(interaction.id, interaction.token),
      { body: payload, files }
    );
  }

  public async interactionEditOriginal(
    interaction: APIInteraction,
    msg: APIInteractionResponseCallbackData
  ): Promise<void> {
    // Webhooks use application id not interaction id
    await this.rest.patch(
      Routes.webhookMessage(interaction.application_id, interaction.token),
      {
        body: msg,
      }
    );
  }

  public sendChannelMessage(
    channelID: string,
    data: RESTPostAPIChannelMessageJSONBody
  ): Promise<RESTPostAPIChannelMessageResult> {
    return this.rest.post(Routes.channelMessages(channelID), {
      body: data,
    }) as Promise<RESTPostAPIChannelMessageResult>;
  }

  public getChannelMessage(
    channelID: string,
    messageID: string
  ): Promise<RESTGetAPIChannelMessageResult> {
    return this.rest.get(
      Routes.channelMessage(channelID, messageID)
    ) as Promise<RESTGetAPIChannelMessageResult>;
  }

  public editChannelMessage(
    channelID: string,
    messageID: string,
    msg: RESTPatchAPIChannelMessageJSONBody
  ): Promise<RESTPatchAPIChannelMessageResult> {
    return this.rest.patch(Routes.channelMessage(channelID, messageID), {
      body: msg,
    }) as Promise<RESTPatchAPIChannelMessageResult>;
  }

  public getUser(userId: string): Promise<RESTGetAPIUserResult> {
    return this.rest.get(Routes.user(userId)) as Promise<RESTGetAPIUserResult>;
  }

  public getMember(
    guildId: string,
    userId: string
  ): Promise<RESTGetAPIGuildMemberResult> {
    return this.rest.get(
      Routes.guildMember(guildId, userId)
    ) as Promise<RESTGetAPIGuildMemberResult>;
  }

  public async banUser(
    guildId: string,
    userId: string,
    reason?: string,
    deleteMessageDays?: number
  ): Promise<void> {
    await this.rest.put(Routes.guildBan(guildId, userId), {
      reason,
      body: { delete_message_days: deleteMessageDays },
    });
  }

  public async kickMember(
    guildId: string,
    userId: string,
    reason?: string
  ): Promise<void> {
    await this.rest.delete(Routes.guildMember(guildId, userId), {
      reason,
    });
  }

  public async timeoutMember(
    guildId: string,
    userId: string,
    communication_disabled_until: dayjs.Dayjs,
    reason?: string
  ): Promise<void> {
    await this.rest.patch(Routes.guildMember(guildId, userId), {
      reason,
      body: {
        communication_disabled_until:
          communication_disabled_until.toISOString(),
      },
    });
  }

  public getGuildRoles(guildId: string): Promise<RESTGetAPIGuildRolesResult> {
    return this.rest.get(
      Routes.guildRoles(guildId)
    ) as Promise<RESTGetAPIGuildRolesResult>;
  }
}
