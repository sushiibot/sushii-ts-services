import { EmbedBuilder, TimestampStyles } from "@discordjs/builders";
import { APIEmbedField, APIUser } from "discord-api-types/v10";
import path from "path";
import { ModLog } from "../generated/generic";
import { ActionType } from "../interactions/moderation/ActionType";
import Context from "../model/context";
import logger from "../logger";
import toTimestamp from "../utils/toTimestamp";
import { TimeoutChange } from "../types/TimeoutChange";

export default async function buildModLogEmbed(
  ctx: Context,
  actionType: ActionType,
  targetUser: APIUser,
  modCase: Omit<ModLog, "nodeId" | "mutesByGuildIdAndCaseId">,
  timeoutChange?: TimeoutChange
): Promise<EmbedBuilder> {
  let executorUser;
  if (modCase.executorId) {
    const res = await ctx.REST.getUser(modCase.executorId);
    if (res.ok) {
      executorUser = res.val;
    } else {
      logger.warn(res.val, "Failed to fetch mod log executor user");
    }
  }

  if (!executorUser) {
    // sushii as default, or if executor failed to fetch
    executorUser = await ctx.getCurrentUser();
  }

  const fields: APIEmbedField[] = [];

  fields.push({
    name: `User ${actionType}`,
    value: `<@${targetUser.id}> \`${targetUser.username}#${targetUser.discriminator}\` | \`${targetUser.id}\``,
    inline: false,
  });

  fields.push({
    name: "Reason",
    value: modCase.reason || "No reason provided.",
    inline: false,
  });

  if (timeoutChange) {
    if (timeoutChange.actionType === ActionType.Timeout) {
      const newTsR = toTimestamp(
        timeoutChange.new,
        TimestampStyles.RelativeTime
      );
      const dur = timeoutChange.duration.humanize();

      fields.push({
        name: "Timeout Duration",
        value: `${dur}\nExpiring ${newTsR}`,
        inline: false,
      });
    }

    if (timeoutChange.actionType === ActionType.TimeoutAdjust) {
      const newTsR = toTimestamp(
        timeoutChange.new,
        TimestampStyles.RelativeTime
      );
      const dur = timeoutChange.duration.humanize();

      const oldTsR = toTimestamp(
        timeoutChange.old,
        TimestampStyles.RelativeTime
      );

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
        }
      );
    }

    if (timeoutChange.actionType === ActionType.TimeoutRemove) {
      const oldTsR = toTimestamp(
        timeoutChange.old,
        TimestampStyles.RelativeTime
      );

      fields.push({
        name: "Removed Timeout",
        value: `Would have expired ${oldTsR}`,
        inline: false,
      });
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

  const color = ActionType.toColor(actionType);

  return new EmbedBuilder()
    .setAuthor({
      name: `${executorUser.username}#${executorUser.discriminator}`,
      iconURL: ctx.CDN.userFaceURL(executorUser),
    })
    .setFields(fields)
    .setColor(color)
    .setFooter({
      text: `Case #${modCase.caseId}`,
    })
    .setImage(modCase.attachments.at(0) || null)
    .setTimestamp(new Date());
}
