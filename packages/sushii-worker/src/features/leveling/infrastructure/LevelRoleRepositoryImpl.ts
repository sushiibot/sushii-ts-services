import { eq } from "drizzle-orm";
import { levelRolesInAppPublic } from "src/infrastructure/database/schema";
import { LevelRole } from "../domain/entities/LevelRole";
import { LevelRoleRepository } from "../domain/repositories/LevelRoleRepository";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export class LevelRoleRepositoryImpl implements LevelRoleRepository {
  constructor(private readonly db: NodePgDatabase) {}
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
