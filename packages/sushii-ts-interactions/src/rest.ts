import { REST } from "@discordjs/rest";
import {
  Routes,
  RESTPostAPIInteractionCallbackJSONBody,
  APIInteractionResponseCallbackData,
  InteractionResponseType,
  RESTGetAPIUserResult,
  RESTGetAPIGuildMemberResult,
  APIInteraction,
} from "discord-api-types/v9";
import { ConfigI } from "./config";
import logger from "./logger";

export default class RESTClient {
  private rest: REST;

  constructor(private readonly config: ConfigI) {
    this.rest = new REST({
      api: this.config.proxyUrl,
    }).setToken(config.token);
  }

  public async interactionReply(
    interaction: APIInteraction,
    msg: APIInteractionResponseCallbackData
  ): Promise<void> {
    return this.interactionCallback(interaction.id, interaction.token, {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: msg,
    });
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
    return this.interactionCallback(interaction.id, interaction.token, {
      type: InteractionResponseType.UpdateMessage,
      data: msg,
    });
  }

  public async interactionCallback(
    interactionId: string,
    interactionToken: string,
    payload: RESTPostAPIInteractionCallbackJSONBody
  ): Promise<void> {
    // TODO: Handle errors, determine response type
    await this.rest.post(
      Routes.interactionCallback(interactionId, interactionToken),
      { body: payload }
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
    reason?: string
  ): Promise<void> {
    await this.rest.put(Routes.guildBan(guildId, userId), { reason });
  }
}
