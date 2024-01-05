import { ChannelType } from "discord.js";
import logger from "../logger";
import Context from "../model/context";
import BackgroundTask from "./BackgroundTask";
import db from "../model/db";
import { getAndEndPendingGiveaways } from "../db/Giveaway/Giveaway.repository";
import {
  endGiveaway,
  updateGiveawayMessage,
} from "../interactions/giveaway/Giveaway.service";

const task: BackgroundTask = {
  name: "Check for expired giveaways",

  // Every 30 seconds
  cronTime: "*/30 * * * * *",

  async onTick(ctx: Context): Promise<void> {
    const expiredGiveaways = await getAndEndPendingGiveaways(db);

    logger.info(
      {
        expiredGiveaways: expiredGiveaways.length,
      },
      "completing all ended giveaways",
    );

    /* eslint-disable no-await-in-loop */
    for (const giveaway of expiredGiveaways) {
      const giveawayChannel = ctx.client.channels.cache.get(
        giveaway.channel_id,
      );
      if (!giveawayChannel || !giveawayChannel.isTextBased()) {
        logger.info(
          {
            giveawayId: giveaway.id,
            giveawayChannelId: giveaway.channel_id,
          },
          "giveaway channel not found or not text based",
        );

        continue;
      }

      if (giveawayChannel.type !== ChannelType.GuildText) {
        logger.info(
          {
            giveawayId: giveaway.id,
            giveawayChannelId: giveaway.channel_id,
          },
          "giveaway channel is not a guild text channel",
        );

        continue;
      }

      const { winnerIds } = await endGiveaway(
        giveawayChannel,
        giveaway.id,
        giveaway,
        // Auto end ignore allow_repeat_winners
        false,
        // Pick the same number as desired
        giveaway.num_winners,
      );

      await updateGiveawayMessage(giveawayChannel, giveaway, winnerIds);
    }
    /* eslint-enable no-await-in-loop */
  },
};

export default task;
