import {
  DiscordAPIError,
  EmbedBuilder,
  Guild,
  RESTJSONErrorCodes,
  User,
} from "discord.js";
import dayjs from "dayjs";
import { getPoolByNameAndGuildId } from "../../interactions/moderation/ban_pools/BanPool.repository";
import db from "../../model/db";
import { getBanPoolAllMembers } from "../../interactions/moderation/ban_pools/BanPoolMember.repository";
import { banPoolEmitter } from "./BanPoolEmitter";
import logger from "../../logger";
import { AppPublicBanPoolAddAction } from "../../model/dbTypes";
import { getGuildSettings } from "../../interactions/moderation/ban_pools/GuildSettings.repository";

const log = logger.child({ module: "BanPoolHandler" });

async function sendPoolAddPromptMessage(
  user: User,
  guild: Guild,
  poolName: string,
): Promise<void> {
  const settings = await getGuildSettings(db, guild.id);
  if (!settings || !settings.alert_channel_id) {
    // alert channel needed to send prompt
    return;
  }

  const channel = guild.channels.cache.get(settings.alert_channel_id);
  if (!channel) {
    log.debug(
      {
        guildId: guild.id,
        channelId: settings.alert_channel_id,
      },
      "Alert channel not found",
    );
    return;
  }

  if (!channel.isTextBased()) {
    log.warn(
      {
        guildId: guild.id,
        channelId: settings.alert_channel_id,
      },
      "Alert channel is not text based",
    );
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle("User added to ban pool")
    .setDescription("What would you like to do?")
    .addFields(
      {
        name: "User",
        value: `${user.tag} (${user.id})`,
      },
      {
        name: "Pool",
        value: `${poolName}`,
      },
    );

  await channel.send({
    embeds: [embed],
  });
}

async function handleAddAction(
  user: User,
  guild: Guild,
  poolName: string,
  action: AppPublicBanPoolAddAction,
): Promise<void> {
  switch (action) {
    case "ban": {
      await guild.members.ban(user.id, {
        reason: `Ban pool - ${poolName}`,
      });

      break;
    }
    case "timeout_and_ask": {
      try {
        await guild.members.edit(user.id, {
          // Timeout for 1 day
          communicationDisabledUntil: dayjs.utc().add(1, "day").toDate(),
        });
      } catch (err) {
        if (!(err instanceof DiscordAPIError)) {
          log.warn(err, "Failed to timeout user");
        } else if (err.code !== RESTJSONErrorCodes.UnknownMember) {
          // Discord API error that is NOT unknown member
          log.warn(err, "Failed to timeout user due to Discord.js rest error");
        }

        // Ignore error, user is likely to be not in the guild
      }

      await sendPoolAddPromptMessage(user, guild, poolName);

      break;
    }
    case "ask": {
      await sendPoolAddPromptMessage(user, guild, poolName);
      break;
    }

    case "nothing": {
      break;
    }
  }
}

// Handle when a user is added to a pool. This will send actions to all members
// of the specific pool.
banPoolEmitter.on(
  "poolAdd",
  async ({ ownerGuildId, poolName, sourceGuildId, user }) => {
    // Fetch the pool for metadata
    const pool = await getPoolByNameAndGuildId(db, poolName, ownerGuildId);
    if (!pool) {
      // members should be cascade deleted if pool is deleted, so this shouldn't happen
      throw new Error(
        `pool ${poolName} (${ownerGuildId}) should exist if membership exists`,
      );
    }

    // Fetch all pool members
    // TODO: Watch out for pools with a lot of members, but for now it's fine
    const poolMembers = await getBanPoolAllMembers(db, poolName, ownerGuildId);

    log.debug(
      {
        banUserId: user.id,
        banGuildId: sourceGuildId,
        poolName: pool.pool_name,
        poolOwnerGuildId: pool.guild_id,
        poolMembers: poolMembers.length,
      },
      "Running actions for pool members on user ban",
    );

    // Run actions in all member servers
    /* eslint-disable no-await-in-loop */
    for (const member of poolMembers) {
      // Skip the current guild -- no need to run actions on the same guild
      if (sourceGuildId === member.member_guild_id) {
        continue;
      }

      const memberGuild = user.client.guilds.cache.get(member.member_guild_id);
      if (!memberGuild) {
        log.warn(
          {
            poolName: pool.pool_name,
            poolOwnerGuildId: member.owner_guild_id,
            poolMemberId: member.member_guild_id,
          },
          "Guild not found for pool member",
        );

        continue;
      }

      // Run the action on the MEMBER guild
      await handleAddAction(
        user,
        memberGuild,
        pool.pool_name,
        member.add_action,
      );
    }
    /* eslint-enable */
  },
);
