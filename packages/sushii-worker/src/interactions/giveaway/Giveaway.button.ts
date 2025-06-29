import {
  ButtonInteraction,
  MessageFlags,
  EmbedBuilder,
  Message,
  InteractionResponse,
} from "discord.js";
import { ButtonHandler } from "../handlers";
import Context from "../../model/context";
import customIds from "../customIds";
import {
  createGiveawayEntries,
  deleteGiveawayEntry,
  getGiveaway,
  getGiveawayEntry,
  getGiveawayEntryCount,
} from "../../db/Giveaway/Giveaway.repository";
import db from "../../infrastructure/database/db";
import { isEligibleForGiveaway } from "./Giveaway.service";
import Color from "../../utils/colors";
import {
  getGiveawayComponents,
  getRemoveEntryComponents,
} from "./Giveaway.components";
import logger from "../../logger";

const log = logger.child({ module: "GiveawayButtonHandler" });

// giveawayId -> userId[]
type GiveawayCacheEntry = {
  users: string[];
  message: Message<true>;
};

const entryCache = new Map<string, GiveawayCacheEntry>();
let insertTimer: NodeJS.Timeout;

async function flushCacheToDb(): Promise<void> {
  const uniqueGiveaways = Array(...entryCache.entries()).map(
    ([, entry]) => entry.message,
  );

  const allEntries = Array(...entryCache.entries()).flatMap(([gid, entry]) =>
    entry.users.map((uid) => ({
      giveaway_id: gid,
      user_id: uid,
    })),
  );

  entryCache.clear();
  const insertResult = await createGiveawayEntries(db, allEntries);

  log.debug(
    {
      cacheSize: allEntries.length,
      dbInsertedSize: insertResult.numInsertedOrUpdatedRows,
      cacheAfterSize: entryCache.size,
    },
    "Flushing cached entries to database and updating messages",
  );

  // Update all giveaways with new entry count

  /* eslint-disable no-await-in-loop */
  for (const giveaway of uniqueGiveaways) {
    const totalEntries = await getGiveawayEntryCount(db, giveaway.id);
    const components = getGiveawayComponents(totalEntries, false);

    await giveaway.edit({
      embeds: giveaway.embeds,
      components,
    });
  }
  /* eslint-enable no-await-in-loop */
}

async function addEntry(
  giveawayMsg: Message<true>,
  giveawayId: string,
  userId: string,
): Promise<void> {
  let entries = entryCache.get(giveawayId);
  if (!entries) {
    entries = {
      users: [],
      message: giveawayMsg,
    };
  }

  // Push entry to cache
  entries.users.push(userId);
  entryCache.set(giveawayId, entries);

  log.debug(
    {
      giveawayId,
      userId,
    },
    "Added entry to cache & clearing timeout",
  );

  // Clear and restart the timer
  clearTimeout(insertTimer);

  // This will bulk insert the pending entries after 5 seconds of inactivity.
  insertTimer = setTimeout(async () => {
    await flushCacheToDb();
  }, 5000);
}

async function isAlreadyEntered(
  giveawayId: string,
  userId: string,
): Promise<boolean> {
  // First check cache
  if (entryCache.has(giveawayId)) {
    const entries = entryCache.get(giveawayId);

    if (entries?.users.includes(userId)) {
      return true;
    }
  }

  // Check db if not in cache
  const entry = await getGiveawayEntry(db, giveawayId, userId);
  return !!entry;
}

async function awaitRemoveEntryButton(
  interactionResp: InteractionResponse<true>,
  giveawayId: string,
  userId: string,
): Promise<void> {
  log.debug(
    {
      giveawayId,
      userId,
    },
    "Awaiting remove entry button",
  );

  try {
    // Call awaitMessageComponent on the message instead of interactionResponse,
    // some bug with it cause it never to resolve
    const msg = await interactionResp.fetch();
    await msg.awaitMessageComponent({
      // 2 Minutes
      time: 1000 * 60 * 2,
    });
  } catch (err) {
    log.debug(
      {
        giveawayId,
        userId,
      },
      "Remove entry button timed out",
    );

    // Delete the message to remove giveaway entry
    await interactionResp.delete();

    // Promise rejects if expired, so just return
    return;
  }

  log.debug(
    {
      giveawayId,
      userId,
    },
    "Remove entry button clicked, deleting giveaway",
  );
  await deleteGiveawayEntry(db, giveawayId, userId);

  const embed = new EmbedBuilder()
    .setTitle("Entry deleted")
    .setDescription(
      "You've deleted your giveaway entry. You can enter again by clicking the original giveaway button.",
    )
    .setColor(Color.Error);

  await interactionResp.edit({
    embeds: [embed],
    components: [],
  });
}

export default class GiveawayButtonHandler extends ButtonHandler {
  customIDMatch = customIds.giveawayEnterButton.match;

  // eslint-disable-next-line class-methods-use-this
  async handleInteraction(
    ctx: Context,
    interaction: ButtonInteraction,
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Not a guild interaction");
    }

    const alreadyEntered = await isAlreadyEntered(
      interaction.message.id,
      interaction.user.id,
    );
    if (alreadyEntered) {
      const embed = new EmbedBuilder()
        .setTitle("You've already entered the giveaway!")
        .setDescription("You can remove your entry below.")
        .setColor(Color.Error);

      const components = getRemoveEntryComponents();

      const deleteEntryMsg = await interaction.reply({
        embeds: [embed],
        components,
        flags: MessageFlags.Ephemeral,
      });

      await awaitRemoveEntryButton(
        deleteEntryMsg,
        interaction.message.id,
        interaction.user.id,
      );

      return;
    }

    const giveaway = await getGiveaway(
      db,
      interaction.guildId,
      interaction.message.id,
    );

    if (!giveaway) {
      const embed = new EmbedBuilder()
        .setTitle("Giveaway not found")
        .setDescription(
          "Hmm... I either couldn't find this giveaway or it might have been deleted.",
        )
        .setColor(Color.Error);

      await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    const eligibility = await isEligibleForGiveaway(
      giveaway,
      interaction.member,
    );

    if (!eligibility.eligible) {
      const embed = new EmbedBuilder()
        .setTitle("You're not eligible to enter this giveaway :(")
        .setColor(Color.Error)
        .setDescription(eligibility.reason);

      await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    await addEntry(interaction.message, giveaway.id, interaction.user.id);

    const embed = new EmbedBuilder()
      .setTitle("You've entered the giveaway!")
      .setColor(Color.Success);

    await interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral,
    });
  }
}
