import { ChannelType } from "discord.js";
import logger from "../logger";
import Context from "../model/context";
import BackgroundTask from "./BackgroundTask";
import db from "../model/db";
import {
  countAllActiveGiveaways,
  getAndEndPendingGiveaways,
} from "../db/Giveaway/Giveaway.repository";
import {
  endGiveaway,
  updateGiveawayMessage,
} from "../interactions/giveaway/Giveaway.service";
import {
  activeGiveawaysGauge,
  endedGiveawaysCounter,
} from "../metrics/metrics";

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

      try {
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
      } catch (err) {
        logger.error(
          {
            giveawayId: giveaway.id,
            error: err,
          },
          "failed to end giveaway",
        );
      }
    }
    /* eslint-enable no-await-in-loop */

    // Increment ended metric
    endedGiveawaysCounter.inc(expiredGiveaways.length);

    // Update total active metric
    const totalActive = await countAllActiveGiveaways(db);
    activeGiveawaysGauge.set(Number(totalActive));
  },
};

export default task;
