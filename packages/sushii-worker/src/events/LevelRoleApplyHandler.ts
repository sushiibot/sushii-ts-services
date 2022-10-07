import { EmbedBuilder } from "@discordjs/builders";
import {
  GatewayDispatchEvents,
  GatewayGuildMembersChunkDispatchData,
} from "discord-api-types/v10";
import customIds from "../interactions/customIds";
import logger from "../logger";
import Context from "../model/context";
import Color from "../utils/colors";
import EventHandler from "./EventHandler";

interface RoleUpdateResult {
  skipped: number;
  applied: number;
  notFound: number;
  failed: number;
}

interface LevelApplyResultData {
  result: RoleUpdateResult;
}

export default class LevelHandler implements EventHandler {
  eventTypes = [GatewayDispatchEvents.GuildMembersChunk];

  async handler(
    ctx: Context,
    eventType: GatewayDispatchEvents,
    event: GatewayGuildMembersChunkDispatchData
  ): Promise<void> {
    if (!event.nonce) {
      // Not a level apply event
      return;
    }

    const parseEvent = customIds.levelRoleApplyMemberRequest.match(event.nonce);

    if (!parseEvent) {
      // No match, not a level apply event
      return;
    }

    logger.debug(
      {
        guildId: event.guild_id,
        chunkIndex: event.chunk_index,
        chunkCount: event.chunk_count,
      },
      "Level role apply member chunk"
    );

    const jobRes = await ctx.sushiiAPI.sdk.getLevelRoleApplyJobByGuildId({
      guildId: event.guild_id,
    });

    if (!jobRes.levelRoleApplyJobByGuildId) {
      throw new Error(
        "Level role apply job not found for member chunk data event"
      );
    }

    const jobData = jobRes.levelRoleApplyJobByGuildId;

    // Does not throw error
    const { result } = await this.applyRoles(ctx, eventType, event);

    // Update job
    // TODO: Handle race condition, concurrent event handles will make this
    // outdated
    await ctx.sushiiAPI.sdk.updateLevelRoleApplyJob({
      guildId: event.guild_id,
      levelRoleApplyJobPatch: {
        requestsProcessed: jobData.requestsProcessed + 1,
        membersApplied: jobData.membersApplied + result.applied,
        membersSkipped: jobData.membersSkipped + result.skipped,
        membersNotFound: jobData.membersNotFound + result.notFound,
      },
    });

    const resultTotalProcessed =
      result.applied + result.skipped + result.notFound + result.failed;

    const newTotalProcessed =
      parseInt(jobData.membersTotalProcessed, 10) + resultTotalProcessed;

    const isFinished = newTotalProcessed >= parseInt(jobData.membersTotal, 10);

    let description = "";
    if (isFinished) {
      description = `Finished processing ${jobData.membersTotal} members!`;
    } else {
      description = `<a:sushiiRotate:1024111705967579226> Processed ${newTotalProcessed} / ${jobData.membersTotal} members`;
    }

    const res = await ctx.REST.editChannelMessage(
      jobData.channelId,
      jobData.messageId,
      {
        embeds: [
          new EmbedBuilder()
            .setTitle(
              isFinished
                ? "Finished applying level roles"
                : "Applying level roles"
            )
            .setDescription(description)
            .setColor(isFinished ? Color.Success : Color.Info)
            .toJSON(),
        ],
      }
    );

    if (res && res.err) {
      logger.error(
        {
          guildId: event.guild_id,
          channelId: jobData.channelId,
          messageId: jobData.messageId,
          err: res.err,
        },
        "Level role apply update message error"
      );
    }

    // Delete level role job
    if (isFinished) {
      await ctx.sushiiAPI.sdk.deleteLevelRoleApplyJob({
        guildId: event.guild_id,
      });
    }
  }

  async applyRoles(
    ctx: Context,
    _: GatewayDispatchEvents,
    event: GatewayGuildMembersChunkDispatchData
  ): Promise<LevelApplyResultData> {
    const membersMap = new Map(event.members.map((m) => [m.user!.id, m]));

    // This only contains the members in the chunk request
    const applyLevelRoles = await ctx.sushiiAPI.sdk.getEligibleLevelRoles({
      guildId: event.guild_id,
      userIds: event.members.map((m) => m.user!.id),
    });

    const applyLevelRolesData =
      applyLevelRoles.getEligibleLevelRoles?.nodes || [];

    const result: RoleUpdateResult = {
      applied: 0,
      skipped: 0,
      notFound: event.not_found?.length || 0,
      failed: 0,
    };

    /* eslint-disable no-continue */
    for (const levelRole of applyLevelRolesData) {
      if (!levelRole.roleIds || !levelRole.userId) {
        result.failed += 1;

        logger.warn("Level role missing roleIds or userId");
        continue;
      }

      // Get the member, this can contain users that left the guild
      const member = membersMap.get(levelRole.userId);
      if (!member) {
        continue;
      }

      const applyRoleIds = levelRole.roleIds.filter(
        (roleId): roleId is string => !!roleId
      );

      // Check which roles to add to the member, if any
      const toAddRoleIds = applyRoleIds.filter(
        (roleId) => !member.roles.includes(roleId)
      );

      // Stop if there are no roles to add
      if (toAddRoleIds.length === 0) {
        result.skipped += 1;

        logger.debug(
          {
            guildId: event.guild_id,
            userId: levelRole.userId,
            applyRoleIds,
          },
          "Level role apply member already has all roles"
        );

        continue;
      }

      // Add the roles to the member -- fine to await in loop since it's
      // going to be rate limited anyways
      try {
        // eslint-disable-next-line no-await-in-loop
        await ctx.REST.setMemberRoles(event.guild_id, levelRole.userId, [
          // Existing roles
          ...member.roles,
          // New roles, these should not be in the existing roles
          ...toAddRoleIds,
        ]);
      } catch (err) {
        result.failed += 1;

        logger.error(
          {
            guildId: event.guild_id,
            userId: levelRole.userId,
            applyRoleIds,
            err,
          },
          "Level role apply set member roles error"
        );

        continue;
      }

      result.applied += 1;
    }
    /* eslint-enable */

    return {
      result,
    };
  }
}
