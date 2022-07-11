import { DiscordAPIError, RawFile, REST } from "@discordjs/rest";
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
  RESTPostAPICurrentUserCreateDMChannelResult,
  RESTPutAPIGuildBanResult,
  RESTPatchAPIGuildMemberResult,
  RESTDeleteAPIGuildMemberResult,
  RESTPatchAPIWebhookWithTokenMessageResult,
  RESTPostAPIInteractionFollowupResult,
} from "discord-api-types/v10";
import { Ok, Err, Result } from "ts-results";
import { ConfigI } from "./config";

export type APIPromiseResult<T> = Promise<Result<T, DiscordAPIError>>;

export default class RESTClient {
  private rest: REST;

  constructor(private readonly config: ConfigI) {
    this.rest = new REST({
      version: "10",
      api: this.config.proxyUrl,
    }).setToken(config.token);
  }

  public interactionReply(
    interaction: APIInteraction,
    msg: APIInteractionResponseCallbackData,
    files?: RawFile[]
  ): APIPromiseResult<RESTPostAPIInteractionFollowupResult> {
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
  public interactionEdit(
    interaction: APIInteraction,
    msg: APIInteractionResponseCallbackData
  ): APIPromiseResult<RESTPostAPIInteractionFollowupResult> {
    return this.interactionCallback(interaction, {
      type: InteractionResponseType.UpdateMessage,
      data: msg,
    });
  }

  public interactionCallback(
    interaction: APIInteraction,
    payload: RESTPostAPIInteractionCallbackJSONBody,
    files?: RawFile[]
  ): APIPromiseResult<RESTPostAPIInteractionFollowupResult> {
    // TODO: Handle errors, determine response type
    return this.handleError(
      this.rest.post(
        Routes.interactionCallback(interaction.id, interaction.token),
        { body: payload, files }
      )
    );
  }

  public interactionEditOriginal(
    interaction: APIInteraction,
    msg: APIInteractionResponseCallbackData
  ): APIPromiseResult<RESTPatchAPIWebhookWithTokenMessageResult> {
    // Webhooks use application id not interaction id
    return this.handleError(
      this.rest.patch(
        Routes.webhookMessage(interaction.application_id, interaction.token),
        {
          body: msg,
        }
      )
    );
  }

  public sendChannelMessage(
    channelID: string,
    data: RESTPostAPIChannelMessageJSONBody
  ): APIPromiseResult<RESTPostAPIChannelMessageResult> {
    return this.handleError(
      this.rest.post(Routes.channelMessages(channelID), {
        body: data,
      })
    );
  }

  public getChannelMessage(
    channelID: string,
    messageID: string
  ): APIPromiseResult<RESTGetAPIChannelMessageResult> {
    return this.handleError(
      this.rest.get(Routes.channelMessage(channelID, messageID))
    );
  }

  public editChannelMessage(
    channelID: string,
    messageID: string,
    msg: RESTPatchAPIChannelMessageJSONBody
  ): APIPromiseResult<RESTPatchAPIChannelMessageResult> {
    return this.handleError(
      this.rest.patch(Routes.channelMessage(channelID, messageID), {
        body: msg,
      })
    );
  }

  public getUser(userId: string): APIPromiseResult<RESTGetAPIUserResult> {
    return this.handleError(this.rest.get(Routes.user(userId)));
  }

  public getMember(
    guildId: string,
    userId: string
  ): APIPromiseResult<RESTGetAPIGuildMemberResult> {
    return this.handleError<RESTGetAPIGuildMemberResult>(
      this.rest.get(Routes.guildMember(guildId, userId))
    );
  }

  public banUser(
    guildId: string,
    userId: string,
    reason?: string,
    deleteMessageDays?: number
  ): APIPromiseResult<RESTPutAPIGuildBanResult> {
    return this.handleError<RESTPutAPIGuildBanResult>(
      this.rest.put(Routes.guildBan(guildId, userId), {
        reason,
        body: { delete_message_days: deleteMessageDays },
      })
    );
  }

  public kickMember(
    guildId: string,
    userId: string,
    reason?: string
  ): APIPromiseResult<RESTDeleteAPIGuildMemberResult> {
    return this.handleError(
      this.rest.delete(Routes.guildMember(guildId, userId), {
        reason,
      })
    );
  }

  public timeoutMember(
    guildId: string,
    userId: string,
    communication_disabled_until: dayjs.Dayjs,
    reason?: string
  ): APIPromiseResult<RESTPatchAPIGuildMemberResult> {
    return this.handleError(
      this.rest.patch(Routes.guildMember(guildId, userId), {
        reason,
        body: {
          communication_disabled_until:
            communication_disabled_until.toISOString(),
        },
      })
    );
  }

  public getGuildRoles(
    guildId: string
  ): APIPromiseResult<RESTGetAPIGuildRolesResult> {
    return this.handleError(this.rest.get(Routes.guildRoles(guildId)));
  }

  // User
  public dmUser(
    userId: string,
    data: RESTPostAPIChannelMessageJSONBody
  ): APIPromiseResult<RESTPostAPIChannelMessageResult> {
    return this.handleError(
      this.createDmChannel(userId).then((channel) =>
        this.sendChannelMessage(channel.id, data)
      )
    );
  }

  public createDmChannel(
    userId: string
  ): Promise<RESTPostAPICurrentUserCreateDMChannelResult> {
    return this.rest.post(Routes.userChannels(), {
      body: {
        recipient_id: userId,
      },
    }) as Promise<RESTPostAPICurrentUserCreateDMChannelResult>;
  }

  private async handleError<T>(
    promise: Promise<unknown>
  ): Promise<Result<T, DiscordAPIError>> {
    try {
      const res = await promise;

      return Ok(res as T);
    } catch (err) {
      if (err instanceof DiscordAPIError) {
        return Err(err);
      }

      // Errors that commands can't really or shouldn't handle, idk
      throw err;
    }
  }
}
