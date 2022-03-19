import { CDN } from "@discordjs/rest";
import { APIGuildMember, APIUser } from "discord-api-types/v9";

export default class CDNClient {
  private cdn: CDN;

  constructor(cdnBaseURl?: string | undefined) {
    this.cdn = new CDN(cdnBaseURl);
  }

  public memberFaceURL(
    guildId: string,
    member: APIGuildMember,
    userId: string
  ): string | null {
    return member.avatar
      ? this.cdn.guildMemberAvatar(guildId, userId, member.avatar)
      : null;
  }

  public userFaceURL(user: APIUser): string {
    return user.avatar
      ? this.cdn.avatar(user.id, user.avatar)
      : this.cdn.defaultAvatar(parseInt(user.discriminator, 10));
  }

  public userBannerURL(user: APIUser): string | null {
    return user.banner ? this.cdn.banner(user.id, user.banner) : null;
  }
}
