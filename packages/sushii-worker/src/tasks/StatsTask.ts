import logger from "@/shared/infrastructure/logger";
import Context from "../model/context";
import BackgroundTask from "./BackgroundTask";
import db from "../infrastructure/database/db";
import { guildGauge, membersGauge } from "@/infrastructure/metrics/metrics";

export enum StatName {
  GuildCount = "guild_count",
  // Should actually be user count
  MemberCount = "member_count",
  CommandCount = "command_count",
}

export async function updateStat(
  name: StatName,
  value: number,
  action: "set" | "add",
): Promise<void> {
  logger.info(
    {
      stat: name,
      value,
      action,
    },
    "Updating bot stat",
  );

  if (action === "add") {
    await db
      .insertInto("app_public.bot_stats")
      .values({
        name,
        category: "bot",
        count: value,
      })
      .onConflict((oc) =>
        oc.columns(["name", "category"]).doUpdateSet({
          count: (eb) =>
            eb("app_public.bot_stats.count", "+", value.toString()),
        }),
      )
      .execute();
  } else {
    await db
      .insertInto("app_public.bot_stats")
      .values({
        name,
        category: "bot",
        count: value,
      })
      .onConflict((oc) =>
        oc.columns(["name", "category"]).doUpdateSet({
          count: value,
        }),
      )
      .execute();
  }
}

const task: BackgroundTask = {
  name: "Update bot stats in db",

  // Cron every 10 minutes
  cronTime: "*/10 * * * *",

  async onTick(ctx: Context): Promise<void> {
    // Get all shard data
    const shardData = await ctx.client.cluster.broadcastEval((client) => ({
      guildCount: client.guilds.cache.size,
      memberCount: client.guilds.cache.reduce(
        (acc, guild) => acc + guild.memberCount,
        0,
      ),
    }));

    const totalGuilds =
      shardData?.reduce((acc, data) => acc + (data.guildCount ?? 0), 0) ?? 0;
    const totalMembers =
      shardData?.reduce((acc, data) => acc + (data.memberCount ?? 0), 0) ?? 0;

    await updateStat(StatName.GuildCount, totalGuilds, "set");
    await updateStat(StatName.MemberCount, totalMembers, "set");

    // Set prometheus metrics
    guildGauge.set(ctx.client.guilds.cache.size);
    membersGauge.set(totalMembers);
  },
};

export default task;
