import { EmbedBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import { t } from "i18next";
import { GetUserModLogHistoryQuery } from "../../../generated/graphql";
import Color from "../../../utils/colors";

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

  // Build case history
  const casesStr = query.allModLogs.nodes.map((c) => {
    let s = `\`#${c.caseId}\` **${c.action}** <t:${dayjs
      .utc(c.actionTime)
      .unix()}:R>`;
    if (c.reason && c.executorId) {
      s += `\n┣ **By:** <@${c.executorId}>`;
    }

    if (c.reason) {
      s += `\n┗ **Reason:** ${c.reason}`;
    }

    return s;
  });

  embed = embed.setDescription(casesStr.join("\n"));

  return embed;
}
