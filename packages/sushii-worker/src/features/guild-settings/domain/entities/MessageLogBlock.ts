export type MessageLogBlockType = "all" | "edits" | "deletes";

export class MessageLogBlock {
  constructor(
    public readonly guildId: string,
    public readonly channelId: string,
    public readonly blockType: MessageLogBlockType,
  ) {}

  static create(
    guildId: string,
    channelId: string,
    blockType: MessageLogBlockType,
  ): MessageLogBlock {
    return new MessageLogBlock(guildId, channelId, blockType);
  }

  getBlockTypeDescription(): string {
    switch (this.blockType) {
      case "all":
        return "edits and deletes";
      case "deletes":
        return "deletes only";
      case "edits":
        return "edits only";
    }
  }
}
