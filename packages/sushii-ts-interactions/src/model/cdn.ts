import { CDN, ImageURLOptions } from "@discordjs/rest";
import { APIGuildMember, APIUser } from "discord-api-types/v10";

export default class CDNClient {
  private cdn: CDN;

  constructor(cdnBaseURl?: string | undefined) {
    this.cdn = new CDN(cdnBaseURl);
  }

  public memberFaceURL(
    guildId: string,
    member: APIGuildMember,
    userId: string,
    options?: ImageURLOptions
  ): string | null {
    return member.avatar
      ? this.cdn.guildMemberAvatar(guildId, userId, member.avatar, options)
      : null;
  }

  public userFaceURL(user: APIUser, options?: ImageURLOptions): string {
    return user.avatar
      ? this.cdn.avatar(user.id, user.avatar, options)
      : this.cdn.defaultAvatar(parseInt(user.discriminator, 10));
  }

  public userBannerURL(user: APIUser): string | null {
    return user.banner ? this.cdn.banner(user.id, user.banner) : null;
  }
}
