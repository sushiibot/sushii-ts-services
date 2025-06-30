import { XpBlock } from "../entities/XpBlock";

export interface XpBlockRepository {
  findActiveBlocks(
    guildId: string,
    channelId: string,
    roleIds: string[],
  ): Promise<XpBlock[]>;
}
