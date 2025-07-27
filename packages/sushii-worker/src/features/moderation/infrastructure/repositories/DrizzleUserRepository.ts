import { User } from "discord.js";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Logger } from "pino";
import { Err, Ok, Result } from "ts-results";

import * as schema from "@/infrastructure/database/schema";
import { cachedUsersInAppPublic } from "@/infrastructure/database/schema";

import { UserRepository } from "../../domain/repositories/UserRepository";

export class DrizzleUserRepository implements UserRepository {
  constructor(
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly logger: Logger,
  ) {}

  async cacheUser(user: User): Promise<Result<void, string>> {
    try {
      await this.db
        .insert(cachedUsersInAppPublic)
        .values({
          id: BigInt(user.id),
          name: user.username,
          discriminator: 0, // Remove
          avatarUrl: user.displayAvatarURL(),
          lastChecked: new Date(),
        })
        .onConflictDoUpdate({
          target: cachedUsersInAppPublic.id,
          set: {
            name: user.username,
            discriminator: 0, // Remove
            avatarUrl: user.displayAvatarURL(),
            lastChecked: new Date(),
          },
        });

      return Ok.EMPTY;
    } catch (error) {
      this.logger.error({ error, userId: user.id }, "Failed to cache user");
      return Err(`Failed to cache user: ${error}`);
    }
  }
}
