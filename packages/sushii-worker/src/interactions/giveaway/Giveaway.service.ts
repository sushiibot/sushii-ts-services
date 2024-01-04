import {
  ChatInputCommandInteraction,
  GuildMember,
  GuildTextBasedChannel,
  InteractionReplyOptions,
} from "discord.js";
import dayjs from "dayjs";
import {
  createGiveawayEntries,
  getGiveawayEntry,
  getRandomGiveawayEntries,
  markGiveawayEntriesAsPicked,
  updateGiveaway,
} from "../../db/Giveaway/Giveaway.repository";
import { GiveawayRow } from "../../db/Giveaway/Giveaway.table";
import db from "../../model/db";
import { getUserGuildLevel } from "../../db/UserLevel/UserLevel.repository";
import UserLevelProgress from "../user/rank.entity";
import { getErrorMessage } from "../responses/error";
import { GiveawayOption } from "./Giveaway.options";

export function isGiveawayEnded(giveaway: GiveawayRow): boolean {
  if (giveaway.manually_ended) {
    return true;
  }

  return dayjs.utc().isAfter(dayjs.utc(giveaway.end_at));
}

async function getGiveawayChannel(
  interaction: ChatInputCommandInteraction<"cached">,
  giveaway: GiveawayRow,
): Promise<GuildTextBasedChannel> {
  if (giveaway.channel_id === interaction.channelId) {
    if (!interaction.channel) {
      throw new Error("No channel in interaction");
    }

    return interaction.channel;
  }

  const channel = await interaction.guild.channels.fetch(giveaway.channel_id);

  if (!channel) {
    throw new Error("Giveaway channel not found");
  }

  if (!channel.isTextBased()) {
    throw new Error("Giveaway channel is not a text channel");
  }

  return channel;
}

export async function rollGiveaway(
  giveawayId: string,
  allowRepeatWinners: boolean,
  winnerCount: number = 1,
): Promise<string[]> {
  const winners = await getRandomGiveawayEntries(
    db,
    giveawayId,
    allowRepeatWinners,
    winnerCount,
  );

  // No entries
  if (winners.length === 0) {
    return [];
  }

  await markGiveawayEntriesAsPicked(
    db,
    giveawayId,
    winners.map((w) => w.user_id),
  );

  return winners.map((w) => w.user_id);
}

export async function endGiveaway(
  interaction: ChatInputCommandInteraction<"cached">,
  giveawayId: string,
  giveaway: GiveawayRow,
  allowRepeatWinners: boolean,
  winnerCount: number,
): Promise<InteractionReplyOptions | null> {
  const newGiveaway = giveaway;

  const winnerIds = await rollGiveaway(
    giveawayId,
    allowRepeatWinners || false,
    winnerCount || 1,
  );
  if (winnerIds.length === 0) {
    return getErrorMessage(
      "No winners found",
      `There were no eligible entries for this giveaway. Do you want to include previously picked users? Run this command again with the **${GiveawayOption.AllowRepeatWinners}** set to **true**`,
      true,
    );
  }

  newGiveaway.manually_ended = true;
  await updateGiveaway(db, newGiveaway.id, newGiveaway);

  const giveawayChannel = await getGiveawayChannel(interaction, newGiveaway);

  const winnersStr = winnerIds.map((id) => `<@${id}>`).join(", ");
  await giveawayChannel.send({
    content: `Congratulations to ${winnersStr}! You won: **${newGiveaway.prize}**`,
    reply: {
      messageReference: newGiveaway.id,
    },
  });

  return null;
}

type GiveawayEligibility =
  | {
      eligible: true;
    }
  | {
      eligible: false;
      reason: string;
    };

export async function isEligibleForGiveaway(
  giveaway: GiveawayRow,
  member: GuildMember,
): Promise<GiveawayEligibility> {
  const guildLevel = await getUserGuildLevel(db, giveaway.guild_id, member.id);

  const allTimeXP = guildLevel?.msg_all_time
    ? parseInt(guildLevel.msg_all_time, 10)
    : 0;
  const userLevel = new UserLevelProgress(allTimeXP);

  if (giveaway.required_min_level !== null) {
    if (userLevel.level < giveaway.required_min_level) {
      return {
        eligible: false,
        reason: `You need to be at least level ${giveaway.required_min_level}`,
      };
    }
  }

  if (giveaway.required_max_level !== null) {
    if (userLevel.level > giveaway.required_max_level) {
      return {
        eligible: false,
        reason: `You need to be at most level ${giveaway.required_max_level}`,
      };
    }
  }

  if (giveaway.required_role_id !== null) {
    if (!member.roles.cache.has(giveaway.required_role_id)) {
      return {
        eligible: false,
        reason: `You need the <@&${giveaway.required_role_id}> role`,
      };
    }
  }

  if (giveaway.required_boosting !== null) {
    if (giveaway.required_boosting === true && !member.premiumSince) {
      return {
        eligible: false,
        reason: "You need to be a server booster",
      };
    }

    if (giveaway.required_boosting === false && member.premiumSince) {
      return {
        eligible: false,
        reason: "You need to __not__ be a server booster",
      };
    }
  }

  return {
    eligible: true,
  };
}

export async function enterGiveaway(
  giveawayId: string,
  userId: string,
): Promise<boolean> {
  return db.transaction().execute(async (trx) => {
    const existingEntry = await getGiveawayEntry(trx, giveawayId, userId);
    if (existingEntry) {
      return false;
    }

    await createGiveawayEntries(trx, [
      {
        giveaway_id: giveawayId,
        user_id: userId,
      },
    ]);
    return true;
  });
}
