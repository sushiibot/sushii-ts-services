import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { levelRolesInAppPublic } from "src/infrastructure/database/schema";

import * as schema from "@/infrastructure/database/schema";

import { LevelRole } from "../domain/entities/LevelRole";
import { LevelRoleRepository } from "../domain/repositories/LevelRoleRepository";

export class LevelRoleRepositoryImpl implements LevelRoleRepository {
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  async findByGuild(guildId: string): Promise<LevelRole[]> {
    const result = await this.db
      .select()
      .from(levelRolesInAppPublic)
      .where(eq(levelRolesInAppPublic.guildId, BigInt(guildId)));

    return result.map(
      (record) =>
        new LevelRole(
          guildId,
          record.roleId.toString(),
          record.addLevel !== null ? Number(record.addLevel) : null,
          record.removeLevel !== null ? Number(record.removeLevel) : null,
        ),
    );
  }
}
