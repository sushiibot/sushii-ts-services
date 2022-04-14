export class CreateRolemenuDto {
  messageId: string;
  guildId: string;
  channelId: string;
  editorId: string;

  constructor(
    messageId: string,
    guildId: string,
    channelId: string,
    editorId: string,
  ) {
    this.messageId = messageId;
    this.guildId = guildId;
    this.channelId = channelId;
    this.editorId = editorId;
  }
}
