import { EmbedBuilder } from "discord.js";
import dayjs from "dayjs";
import { t } from "i18next";
import Color from "../../../utils/colors";
import { ActionType } from "../ActionType";
import { ModLogRow } from "../../../db/ModLog/ModLog.table";

export default function buildUserHistoryEmbed(
  modLogs: ModLogRow[],
  format: "context_menu" | "command",
): EmbedBuilder {
  const count = modLogs.length || 0;

  let embed = new EmbedBuilder()
    .setTitle(
      format === "command"
        ? t("history.command.title", { ns: "commands", count })
        : t("history.context_menu.title", { ns: "commands" }),
    )
    .setColor(Color.Success);

  if (count === 0 && format === "context_menu") {
    embed = embed.setDescription(t("history.context_menu.description_empty"));

    return embed;
  }

  // No description
  if (modLogs.length === 0) {
    return embed;
  }

  const summary = modLogs.reduce((m, item) => {
    const oldCount = m.get(item.action) || 0;
    m.set(item.action, oldCount + 1);

    return m;
  }, new Map<string, number>());

  const summaryStr = Array.from(summary.entries()).map(
    ([action, num]) => `${action} - ${num}`,
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

  embed = embed.setDescription(casesStr.join("\n")).addFields([
    {
      name: t("history.summary"),
      value: summaryStr.join("\n"),
    },
  ]);

  return embed;
}
