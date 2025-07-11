import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { UserProfile } from "../domain/entities/UserProfile";
import { UserProfileRepository } from "../domain/repositories/UserProfileRepository";
import { usersInAppPublic } from "../../../infrastructure/database/schema";
import * as schema from "@/infrastructure/database/schema";

export type DrizzleDB = NodePgDatabase<typeof schema>;

export class DrizzleUserProfileRepository implements UserProfileRepository {
  constructor(private readonly db: DrizzleDB) {}

  private async getUserOrDefault(userId: string) {
    const result = await this.db
      .select()
      .from(usersInAppPublic)
      .where(eq(usersInAppPublic.id, BigInt(userId)))
      .limit(1);

    if (result[0]) {
      return result[0];
    }

    // Return default user if not found
    return {
      id: BigInt(userId),
      rep: 0n,
      fishies: 0n,
      isPatron: false,
      lastFishies: null,
      lastRep: null,
      lastfmUsername: null,
      patronEmoji: null,
      profileData: {},
    };
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    const userData = await this.getUserOrDefault(userId);

    return UserProfile.create(userId, {
      rep: Number(userData.rep),
      fishies: Number(userData.fishies),
      isPatron: userData.isPatron,
      profileData: userData.profileData as { patronEmojiURL?: string } | null,
    });
  }
}
