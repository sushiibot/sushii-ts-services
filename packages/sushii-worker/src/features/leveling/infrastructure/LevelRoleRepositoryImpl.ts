import { eq } from "drizzle-orm";
import { drizzleDb } from "src/infrastructure/database/db";
import { levelRolesInAppPublic } from "src/infrastructure/database/schema";
import { LevelRole } from "../domain/entities/LevelRole";
import { LevelRoleRepository } from "../domain/repositories/LevelRoleRepository";

export class LevelRoleRepositoryImpl implements LevelRoleRepository {
  async findByGuild(guildId: string): Promise<LevelRole[]> {
    const result = await drizzleDb
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
