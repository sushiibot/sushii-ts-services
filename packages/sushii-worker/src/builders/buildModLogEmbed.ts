import { EmbedBuilder } from "@discordjs/builders";
import { APIEmbedField, APIUser } from "discord-api-types/v10";
import path from "path";
import { ModLog } from "../generated/generic";
import { ActionType } from "../interactions/moderation/ActionType";
import Context from "../model/context";
import logger from "../logger";

export default async function buildModLogEmbed(
  ctx: Context,
  actionType: ActionType,
  targetUser: APIUser,
  modCase: Omit<ModLog, "nodeId" | "mutesByGuildIdAndCaseId">
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
