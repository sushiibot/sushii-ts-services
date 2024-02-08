import { EmbedBuilder } from "discord.js";
import dayjs from "dayjs";
import { t } from "i18next";
import Color from "../../../utils/colors";
import { ActionType } from "../ActionType";
import { ModLogRow } from "../../../db/ModLog/ModLog.table";
import buildChunks from "../../../utils/buildChunks";

export default function buildUserHistoryEmbeds(
  modLogs: ModLogRow[],
  format: "context_menu" | "command",
): EmbedBuilder[] {
  const count = modLogs.length || 0;

  let mainEmbed = new EmbedBuilder()
    .setTitle(
      format === "command"
        ? t("history.command.title", { ns: "commands", count })
        : t("history.context_menu.title", { ns: "commands" }),
    )
    .setColor(Color.Success);

  if (count === 0 && format === "context_menu") {
    mainEmbed = mainEmbed.setDescription(
      t("history.context_menu.description_empty"),
    );

    return [mainEmbed];
  }

  // No description
  if (modLogs.length === 0) {
    return [mainEmbed];
  }

  const summary = modLogs.reduce((m, item) => {
    const action = ActionType.fromString(item.action);
    const actionStr = ActionType.toSentenceString(action);

    const oldCount = m.get(actionStr) || 0;
    m.set(actionStr, oldCount + 1);

    return m;
  }, new Map<string, number>());

  const summaryStr = Array.from(summary.entries()).map(
    ([action, num]) => `**${action}** - ${num}`,
  );

  // Build case history
  const casesStr = modLogs.map((c) => {
    const action = ActionType.fromString(c.action);

    // Emoji
    // Case ID
    // Action string
    // Timestamp
    let s =
      `${ActionType.toEmoji(action)} ` +
      `\`#${c.case_id}\` - ` +
      `**${ActionType.toString(action)}** ` +
      `<t:${dayjs.utc(c.action_time).unix()}:R> `;

    if (c.reason && c.executor_id) {
      s += `\n┣ **By:** <@${c.executor_id}>`;
    }

    if (c.reason) {
      s += `\n┗ **Reason:** ${c.reason}`;
    }

    return s;
  });

  const descChunks = buildChunks(casesStr, "\n", 4096);

  // Only return 1 chunk for context menu
  if (format === "context_menu") {
    mainEmbed.setDescription(descChunks[descChunks.length - 1]);
    return [mainEmbed];
  }

  // First embed gets first chunk
  mainEmbed.setDescription(descChunks[0]);

  // Additional embeds get the rest excluding first chunk
  const additionalEmbeds = descChunks
    .slice(1)
    .map((desc) =>
      new EmbedBuilder()
        .setTitle("Case History (Continued)")
        .setColor(Color.Success)
        .setDescription(desc),
    );

  if (additionalEmbeds.length > 0) {
    // Add summary to last embed
    additionalEmbeds[additionalEmbeds.length - 1].addFields([
      {
        name: "Summary",
        value: summaryStr.join("\n"),
      },
    ]);
  } else {
    // Add summary to first embed
    mainEmbed.addFields([
      {
        name: "Summary",
        value: summaryStr.join("\n"),
      },
    ]);
  }

  return [mainEmbed, ...additionalEmbeds];
}
