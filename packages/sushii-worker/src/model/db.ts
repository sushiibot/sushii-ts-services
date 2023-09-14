import { Pool } from "pg";
// or `import * as Cursor from 'pg-cursor'` depending on your tsconfig
import Cursor from "pg-cursor";
import { Kysely, PostgresDialect, sql } from "kysely";
import { AllSelection } from "kysely/dist/cjs/parser/select-parser";
import { UpdateExpression } from "kysely/dist/cjs/parser/update-set-parser";
import opentelemetry, { Span } from "@opentelemetry/api";
import logger from "../logger";
import config from "./config";
import { DB } from "./dbTypes";

const dbLogger = logger.child({ module: "db" });

const tracer = opentelemetry.trace.getTracer("db");

const defaultGuildconfig: AllSelection<DB, "app_public.guild_configs"> = {
  id: "0",
  prefix: null,
  join_msg: null,
  join_msg_enabled: true,
  join_react: null,
  leave_msg: null,
  leave_msg_enabled: true,
  msg_channel: null,
  role_channel: null,
  role_config: null,
  role_enabled: true,
  log_msg: null,
  log_msg_enabled: true,
  log_mod: null,
  log_mod_enabled: true,
  log_member: null,
  log_member_enabled: true,
  mute_dm_text: null,
  mute_dm_enabled: true,
  warn_dm_text: null,
  warn_dm_enabled: true,
  disabled_channels: null,
  lookup_prompted: false,
  lookup_details_opt_in: false,
  data: {},
};

const defaultUser: AllSelection<DB, "app_public.users"> = {
  id: "0",
  rep: "0",
  fishies: "0",
  is_patron: false,
  last_fishies: null,
  last_rep: null,
  lastfm_username: null,
  patron_emoji: null,
  profile_data: {},
};

class SushiiDB extends Kysely<DB> {
  async getGuildConfig(
    guildId: string
  ): Promise<AllSelection<DB, "app_public.guild_configs">> {
    return tracer.startActiveSpan("getGuildConfig", {}, async (span: Span) => {
      const conf = await this.selectFrom("app_public.guild_configs")
        .selectAll()
        .where("id", "=", guildId)
        .executeTakeFirst();

      span.end();

      if (conf) {
        return conf;
      }

      return {
        ...defaultGuildconfig,
        id: guildId,
      };
    });
  }

  async updateGuildConfig(
    guildId: string,
    patch: UpdateExpression<DB, "app_public.guild_configs">
  ): Promise<AllSelection<DB, "app_public.guild_configs">> {
    return this.insertInto("app_public.guild_configs")
      .values({
        id: guildId,
        ...patch,
      })
      .returningAll()
      .onConflict((oc) => oc.column("id").doUpdateSet(patch))
      .executeTakeFirstOrThrow();
  }

  async getNextCaseId(guildId: string): Promise<number> {
    const lastCaseId = await this.selectFrom("app_public.mod_logs")
      .select(
        this.fn
          .coalesce(this.fn.max("case_id"), sql<string>`0`)
          .as("last_case_id")
      )
      .where("guild_id", "=", guildId)
      .executeTakeFirstOrThrow();

    return parseInt(lastCaseId.last_case_id, 10) + 1;
  }

  async getUser(userId: string): Promise<AllSelection<DB, "app_public.users">> {
    const user = await this.selectFrom("app_public.users")
      .selectAll()
      .where("id", "=", userId)
      .executeTakeFirst();

    if (user) {
      return user;
    }

    return {
      ...defaultUser,
      id: userId,
    };
  }

  async updateUser(
    patch: AllSelection<DB, "app_public.users">
  ): Promise<AllSelection<DB, "app_public.users">> {
    return this.insertInto("app_public.users")
      .values({
        ...patch,
        profile_data: sql`${JSON.stringify(patch.profile_data)}`,
      })
      .returningAll()
      .onConflict((oc) =>
        oc.column("id").doUpdateSet({
          ...patch,
          profile_data: sql`${JSON.stringify(patch.profile_data)}`,
        })
      )
      .executeTakeFirstOrThrow();
  }
}

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  max: 20,
});

pool.on("error", (err) => {
  dbLogger.error(err, "pg pool error");
});

const db = new SushiiDB({
  // PostgresDialect requires the Cursor dependency
  dialect: new PostgresDialect({
    pool,
    cursor: Cursor,
  }),
});

dbLogger.info("pg connected");

export default db;
