import { Interaction, InteractionResponse } from "discord.js";
import logger from "../../../logger";
import {
  BanPoolShowMainCustomId,
  BanPoolShowPage,
  SettingsCustomId,
  getSettingsComponents,
} from "./BanPool.component";
import {
  getInvitesEmbed,
  getMembersEmbed,
  getSettingsEmbed,
} from "./BanPool.embed";
import { BanPoolRow, UpdateableBanPoolRow } from "./BanPool.table";
import {
  BanPoolMemberRow,
  UpdateableBanPoolMemberRow,
} from "./BanPoolMember.table";
import {
  getAllBanPoolMemberships,
  getBanPoolMembers,
  updateBanPoolMember,
} from "./BanPoolMember.repository";
import db from "../../../model/db";
import { getAllBanPoolInvites } from "./BanPoolInvite.repository";
import {
  AppPublicBanPoolAddAction,
  AppPublicBanPoolAddMode,
  AppPublicBanPoolRemoveAction,
  AppPublicBanPoolRemoveMode,
} from "../../../model/dbTypes";
import { updatePool } from "./BanPool.repository";

const log = logger.child({ module: "BanPoolShow.button" });

function getGuildNameFnFromInteraction(
  interaction: Interaction,
): (guildId: string) => string | undefined {
  return (guildId: string): string | undefined => {
    const guild = interaction.client.guilds.cache.get(guildId);

    return guild?.name;
  };
}

/**
 * Get the active page from the custom id
 *
 * @param customId custom id of the interaction
 * @returns
 */
function getCurrentPage(customId: string): BanPoolShowPage {
  const pages = [
    BanPoolShowPage.Home,
    BanPoolShowPage.Settings,
    BanPoolShowPage.Members,
    BanPoolShowPage.Invites,
  ];

  for (const page of pages) {
    if (customId.startsWith(page)) {
      return page;
    }
  }

  throw new Error("Unknown page");
}

async function handleHome(
  interaction: Interaction<"cached">,
  pool: BanPoolRow,
  poolMember: BanPoolMemberRow | null,
): Promise<void> {
  if (!interaction.isButton()) {
    throw new Error("Expected button interaction");
  }

  switch (interaction.customId) {
    case BanPoolShowMainCustomId.GoSettings: {
      const embed = getSettingsEmbed(pool, poolMember);
      const components = getSettingsComponents(pool, poolMember);

      await interaction.update({
        embeds: [embed],
        components,
      });

      break;
    }
    case BanPoolShowMainCustomId.GoMembers: {
      const getGuildNameFn = getGuildNameFnFromInteraction(interaction);
      const members = await getAllBanPoolMemberships(db, pool.guild_id);

      const embed = getMembersEmbed(pool, members, getGuildNameFn);
      // TODO: Components
      // const components = getMembersComponents(pool, poolMember);

      await interaction.update({
        embeds: [embed],
        components: [],
      });

      break;
    }
    case BanPoolShowMainCustomId.GoInvites: {
      const invites = await getAllBanPoolInvites(
        db,
        pool.pool_name,
        pool.guild_id,
      );

      const embed = getInvitesEmbed(pool, invites);
      // TODO: Components to delete

      await interaction.update({
        embeds: [embed],
        components: [],
      });

      break;
    }
    default: {
      throw new Error(`Unknown button custom id ${interaction.customId}`);
    }
  }
}

async function handleSettings(
  interaction: Interaction<"cached">,
  pool: BanPoolRow,
  poolMember: BanPoolMemberRow | null,
): Promise<void> {
  // Only select menus are allowed
  // TODO: If we add a button to go back, update this
  if (!interaction.isStringSelectMenu()) {
    throw new Error("Expected select menu interaction");
  }

  const update: UpdateableBanPoolMemberRow | UpdateableBanPoolRow = {};

  // Get the action and set the new value
  // Limited to 1 option, min and max
  // Value is also matches the same type.
  // There won't be multiple set at a time
  switch (interaction.customId) {
    case SettingsCustomId.AddMode: {
      const val = interaction.values[0] as AppPublicBanPoolAddMode;
      update.add_mode = val;

      break;
    }
    case SettingsCustomId.RemoveMode: {
      const val = interaction.values[0] as AppPublicBanPoolRemoveMode;
      update.remove_mode = val;

      break;
    }
    case SettingsCustomId.AddAction: {
      const val = interaction.values[0] as AppPublicBanPoolAddAction;
      update.add_action = val;

      break;
    }
    case SettingsCustomId.RemoveAction: {
      const val = interaction.values[0] as AppPublicBanPoolRemoveAction;
      update.remove_action = val;

      break;
    }
    default: {
      throw new Error(`Unknown select menu custom id ${interaction.customId}`);
    }
  }

  log.debug({ update }, "Received pool settings update");

  let updatedPool = pool;
  let updatedMember = poolMember;

  // Make sure to update the correct owner / member - AND update variables to re-format the embed and components
  if (poolMember) {
    updatedMember = await updateBanPoolMember(db, update);
  } else {
    updatedPool = await updatePool(db, update);
  }

  const embed = getSettingsEmbed(updatedPool, updatedMember);
  const components = getSettingsComponents(updatedPool, updatedMember);

  await interaction.update({
    embeds: [embed],
    components,
  });
}

async function handleMembers(
  interaction: Interaction<"cached">,
  pool: BanPoolRow,
): Promise<void> {
  if (!interaction.isButton()) {
    throw new Error("Expected button interaction");
  }

  const members = await getBanPoolMembers(db, pool.pool_name, pool.guild_id);

  const embed = getMembersEmbed(
    pool,
    members,
    getGuildNameFnFromInteraction(interaction),
  );
  // TODO: Components

  await interaction.update({
    embeds: [embed],
    components: [],
  });
}

async function handleInvites(
  interaction: Interaction<"cached">,
  pool: BanPoolRow,
): Promise<void> {
  if (!interaction.isButton()) {
    throw new Error("Expected button interaction");
  }

  const invites = await getAllBanPoolInvites(db, pool.pool_name, pool.guild_id);

  const embed = getInvitesEmbed(pool, invites);
  // TODO: Components

  await interaction.update({
    embeds: [embed],
    components: [],
  });
}

export async function handleShowMsgInteractions(
  msg: InteractionResponse<true>,
  pool: BanPoolRow,
  poolMember: BanPoolMemberRow | null,
): Promise<void> {
  const collector = msg.createMessageComponentCollector({
    idle: 2 * 60 * 1000, // 2 minutes
  });

  collector.on("collect", async (interaction) => {
    try {
      // Check which page we're on
      const currentPage = getCurrentPage(interaction.customId);

      log.debug({ currentPage }, "received /banpool show message interaction");

      switch (currentPage) {
        case BanPoolShowPage.Home:
          await handleHome(interaction, pool, poolMember);
          break;
        case BanPoolShowPage.Settings:
          await handleSettings(interaction, pool, poolMember);
          break;
        case BanPoolShowPage.Members:
          await handleMembers(interaction, pool);
          break;
        case BanPoolShowPage.Invites:
          if (poolMember) {
            throw Error("This shouldn't be called if member is defined");
          }

          // Owner only
          await handleInvites(interaction, pool);
          break;
        default:
          throw new Error("Unknown page");
      }
    } catch (err) {
      logger.error(err, "Error while handling interaction");
    }
  });

  // Wait until collector is done instead of returning immediately
  await new Promise<void>((resolve) => {
    collector.on("end", async () => {
      try {
        // TODO: Disable components instead of removing

        await msg.edit({
          components: [],
        });

        resolve();
      } catch (err) {
        logger.error(err, "Error while disabling buttons");
      }
    });
  });
}
