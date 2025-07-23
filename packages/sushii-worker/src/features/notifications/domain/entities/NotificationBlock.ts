export type BlockType = "user" | "channel" | "category";

export class NotificationBlock {
  constructor(
    public readonly userId: string,
    public readonly blockId: string,
    public readonly blockType: BlockType,
  ) {}

  static createUserBlock(
    userId: string,
    blockedUserId: string,
  ): NotificationBlock {
    return new NotificationBlock(userId, blockedUserId, "user");
  }

  static createChannelBlock(
    userId: string,
    channelId: string,
  ): NotificationBlock {
    return new NotificationBlock(userId, channelId, "channel");
  }

  static createCategoryBlock(
    userId: string,
    categoryId: string,
  ): NotificationBlock {
    return new NotificationBlock(userId, categoryId, "category");
  }

  get isUserBlock(): boolean {
    return this.blockType === "user";
  }

  get isChannelBlock(): boolean {
    return this.blockType === "channel";
  }

  get isCategoryBlock(): boolean {
    return this.blockType === "category";
  }
}
