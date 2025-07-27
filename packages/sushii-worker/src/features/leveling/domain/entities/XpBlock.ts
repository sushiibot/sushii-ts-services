export type XpBlockType = "channel" | "role";

export class XpBlock {
  constructor(
    private readonly guildId: string,
    private readonly blockId: string,
    private readonly blockType: XpBlockType,
  ) {}

  getGuildId(): string {
    return this.guildId;
  }

  getBlockId(): string {
    return this.blockId;
  }

  getBlockType(): XpBlockType {
    return this.blockType;
  }

  blocksChannel(channelId: string): boolean {
    return this.blockType === "channel" && this.blockId === channelId;
  }

  blocksRole(roleId: string): boolean {
    return this.blockType === "role" && this.blockId === roleId;
  }

  static createChannelBlock(guildId: string, channelId: string): XpBlock {
    return new XpBlock(guildId, channelId, "channel");
  }

  static createRoleBlock(guildId: string, roleId: string): XpBlock {
    return new XpBlock(guildId, roleId, "role");
  }
}
