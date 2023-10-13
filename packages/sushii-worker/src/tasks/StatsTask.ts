import logger from "../logger";
import Context from "../model/context";
import BackgroundTask from "./BackgroundTask";
import db from "../model/db";

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
            eb.bxp("app_public.bot_stats.count", "+", value.toString()),
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

  // Cron every hour
  cronTime: "0 * * * *",

  async onTick(ctx: Context): Promise<void> {
    await updateStat(StatName.GuildCount, ctx.client.guilds.cache.size, "set");

    const totalMembers = ctx.client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
      0,
    );

    await updateStat(StatName.MemberCount, totalMembers, "set");
  },
};

export default task;
