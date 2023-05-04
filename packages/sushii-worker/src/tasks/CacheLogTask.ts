import { memoryUsage } from "node:process";
import logger from "../logger";
import Context from "../model/context";
import BackgroundTask from "./BackgroundTask";

function bytesToMB(bytes: number): string {
  const mb = Math.round((bytes / 1024 / 1024) * 100) / 100;
  return `${mb} MB`;
}

const task: BackgroundTask = {
  name: "Log cache and memory use",

  // Cron every 5 seconds
  cronTime: "*/5 * * * * *",

  async onTick(ctx: Context): Promise<void> {
    const guilds = ctx.client.guilds.cache.size;
    const users = ctx.client.users.cache.size;
    const emojis = ctx.client.emojis.cache.size;
    const channels = ctx.client.channels.cache.size;

    let members = 0;
    let bans = 0;
    for (const guild of ctx.client.guilds.cache.values()) {
      members += guild.members.cache.size;
      bans += guild.bans.cache.size;
    }

    const rawMem = memoryUsage();

    logger.info(
      {
        guilds,
        users,
        emojis,
        channels,
        members,
        bans,
        process: {
          rss: bytesToMB(rawMem.rss),
          heapTotal: bytesToMB(rawMem.heapTotal),
          heapUsed: bytesToMB(rawMem.heapUsed),
          external: bytesToMB(rawMem.external),
          arrayBuffers: bytesToMB(rawMem.arrayBuffers),
        },
      },
      "Current cache"
    );
  },
};

export default task;
