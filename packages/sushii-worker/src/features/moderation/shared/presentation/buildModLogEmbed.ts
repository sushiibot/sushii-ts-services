import { APIEmbedField, EmbedBuilder, TimestampStyles, User } from "discord.js";
import { Client } from "discord.js";
import path from "path";

import logger from "@/shared/infrastructure/logger";
import Color from "@/utils/colors";
import toTimestamp from "@/utils/toTimestamp";
import dayjs from "@/shared/domain/dayjs";

import { ActionType } from "../domain/value-objects/ActionType";
import { TimeoutChange as AuditLogTimeoutChange } from "@/features/moderation/audit-logs/domain/value-objects/TimeoutChange";
import { TimeoutChange as LegacyTimeoutChange } from "@/types/TimeoutChange";

interface ModCase {
  case_id: string;
  executor_id: string | null;
  reason: string | null;
  attachments: string[];
}

// Helper functions to work with both TimeoutChange types
function isAuditLogTimeoutChange(change: AuditLogTimeoutChange | LegacyTimeoutChange): change is AuditLogTimeoutChange {
  return 'newTimestamp' in change || 'oldTimestamp' in change;
}

function getNewTimestamp(change: AuditLogTimeoutChange | LegacyTimeoutChange): dayjs.Dayjs | undefined {
  if (isAuditLogTimeoutChange(change)) {
    return change.newTimestamp ? dayjs(change.newTimestamp) : undefined;
  }
  // Legacy TimeoutChange uses 'new' property with Dayjs
  return (change as any).new;
}

function getOldTimestamp(change: AuditLogTimeoutChange | LegacyTimeoutChange): dayjs.Dayjs | undefined {
  if (isAuditLogTimeoutChange(change)) {
    return change.oldTimestamp ? dayjs(change.oldTimestamp) : undefined;
  }
  // Legacy TimeoutChange uses 'old' property with Dayjs
  return (change as any).old;
}

function getDuration(change: AuditLogTimeoutChange | LegacyTimeoutChange) {
  if (isAuditLogTimeoutChange(change)) {
    return change.duration;
  }
  // Legacy TimeoutChange has duration property when it's a timeout action
  const legacy = change as any;
  return legacy.duration;
}

export default async function buildModLogEmbed(
  client: Client,
  actionType: ActionType,
  targetUser: User,
  modCase: ModCase,
  timeoutChange?: AuditLogTimeoutChange | LegacyTimeoutChange,
): Promise<EmbedBuilder> {
  let executorUser;
  if (modCase.executor_id) {
    try {
      executorUser = await client.users.fetch(modCase.executor_id);
    } catch (err) {
      logger.warn(err, "Failed to fetch mod log executor user");
    }
  }

  if (!executorUser) {
    // sushii as default, or if executor failed to fetch
    executorUser = client.user;
  }

  if (!executorUser) {
    throw new Error("Missing executor user for mod log embed");
  }

  const fields: APIEmbedField[] = [];

  fields.push({
    name: `User ${actionType}`,
    value: `<@${targetUser.id}> ${targetUser.displayName} (\`@${targetUser.tag}\`) | \`${targetUser.id}\``,
    inline: false,
  });

  fields.push({
    name: "Reason",
    value: modCase.reason || "No reason provided.",
    inline: false,
  });

  if (timeoutChange) {
    if (timeoutChange.actionType === ActionType.Timeout) {
      const newTimestamp = getNewTimestamp(timeoutChange);
      const duration = getDuration(timeoutChange);
      
      if (newTimestamp && duration) {
        const newTsR = toTimestamp(newTimestamp, TimestampStyles.RelativeTime);
        const dur = duration.humanize();

        fields.push({
          name: "Timeout Duration",
          value: `${dur}\nExpiring ${newTsR}`,
          inline: false,
        });
      }
    }

    if (timeoutChange.actionType === ActionType.TimeoutAdjust) {
      const newTimestamp = getNewTimestamp(timeoutChange);
      const oldTimestamp = getOldTimestamp(timeoutChange);
      const duration = getDuration(timeoutChange);
      
      if (newTimestamp && oldTimestamp && duration) {
        const newTsR = toTimestamp(newTimestamp, TimestampStyles.RelativeTime);
        const oldTsR = toTimestamp(oldTimestamp, TimestampStyles.RelativeTime);
        const dur = duration.humanize();

        fields.push(
          {
            name: "Timeout Duration",
            value: `${dur}\nExpiring ${newTsR}`,
            inline: false,
          },
          {
            name: "Previous Timeout",
            value: `Would have expired ${oldTsR}`,
            inline: false,
          },
        );
      }
    }

    if (timeoutChange.actionType === ActionType.TimeoutRemove) {
      const oldTimestamp = getOldTimestamp(timeoutChange);
      
      if (oldTimestamp) {
        const oldTsR = toTimestamp(oldTimestamp, TimestampStyles.RelativeTime);

        fields.push({
          name: "Removed Timeout",
          value: `Would have expired ${oldTsR}`,
          inline: false,
        });
      }
    }
  }

  if (modCase.attachments.length > 0) {
    const attachments = modCase.attachments.filter((a): a is string => !!a);

    fields.push({
      name: "Attachments",
      value: attachments
        .map((a) => `[${path.basename(a)}](${a})`)
        .join("\n")
        .slice(0, 1024),
      inline: false,
    });
  }

  const color = Color.Info;

  return new EmbedBuilder()
    .setAuthor({
      name: executorUser.tag,
      iconURL: executorUser.displayAvatarURL(),
    })
    .setFields(fields)
    .setColor(color)
    .setFooter({
      text: `Case #${modCase.case_id}`,
    })
    .setImage(modCase.attachments.at(0) || null)
    .setTimestamp(new Date());
}
