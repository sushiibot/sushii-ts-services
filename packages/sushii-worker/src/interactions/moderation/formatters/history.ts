import { EmbedBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import { t } from "i18next";
import { GetUserModLogHistoryQuery } from "../../../generated/graphql";
import Color from "../../../utils/colors";
import { ActionType } from "../ActionType";

export default function buildUserHistoryEmbed(
  query: GetUserModLogHistoryQuery,
  format: "context_menu" | "command"
): EmbedBuilder {
  const count = query.allModLogs?.nodes.length || 0;

  let embed = new EmbedBuilder()
    .setTitle(
      format === "command"
        ? t("history.command.title", { ns: "commands", count })
        : t("history.context_menu.title", { ns: "commands" })
    )
    .setColor(Color.Success);

  if (count === 0 && format === "context_menu") {
    embed = embed.setDescription(t("history.context_menu.description_empty"));

    return embed;
  }

  // No description
  if (!query.allModLogs?.nodes || query.allModLogs?.nodes.length === 0) {
    return embed;
  }

  const summary = query.allModLogs.nodes.reduce((m, item) => {
    const oldCount = m.get(item.action) || 0;
    m.set(item.action, oldCount + 1);

    return m;
  }, new Map<string, number>());

  const summaryStr = Array.from(summary.entries()).map(
    ([action, num]) => `${action} - ${num}`
  );

  // Build case history
  const casesStr = query.allModLogs.nodes.map((c) => {
    const action = ActionType.fromString(c.action);

    // Emoji
    // Case ID
    // Action string
    // Timestamp
    let s =
      `${ActionType.toEmoji(action)} ` +
      `\`#${c.caseId}\` - ` +
      `**${c.action}** ` +
      `<t:${dayjs.utc(c.actionTime).unix()}:R> `;

    if (c.reason && c.executorId) {
      s += `\n┣ **By:** <@${c.executorId}>`;
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
