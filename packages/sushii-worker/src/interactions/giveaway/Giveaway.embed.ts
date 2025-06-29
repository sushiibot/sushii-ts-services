import { EmbedBuilder } from "discord.js";
import dayjs from "dayjs";
import { InsertableGiveawayRow } from "../../infrastructure/database/schemas/Giveaway.table";
import toTimestamp from "../../utils/toTimestamp";
import Color from "../../utils/colors";

export function getGiveawayEmbed(
  giveaway: InsertableGiveawayRow,
  initialWinnerIds: string[],
): EmbedBuilder {
  const endTime = dayjs.utc(giveaway.end_at);

  let desc = "";
  if (giveaway.is_ended) {
    desc += "Ended ";
  } else {
    desc += "Ends ";
  }

  desc += `${toTimestamp(endTime, "R")} ~ ${toTimestamp(endTime, "f")}`;
  desc += "\n\n";

  desc += `**Host:** <@!${giveaway.host_user_id}>`;
  desc += "\n";
  desc += `**Prize:** ${giveaway.prize}`;
  desc += "\n";

  if (initialWinnerIds.length > 0) {
    const winnersStr = initialWinnerIds.map((id) => `<@${id}>`).join(", ");

    desc += `**Winner${
      initialWinnerIds.length > 1 ? "s" : ""
    }:** ${winnersStr}`;
  } else {
    desc += `**Winners:** ${giveaway.num_winners}`;
  }

  desc += "\n\n";

  let reqDesc = "";

  if (giveaway.required_min_level) {
    reqDesc += `**Minimum Level:** ${giveaway.required_min_level}\n`;
  }

  if (giveaway.required_max_level) {
    reqDesc += `**Maximum Level:** ${giveaway.required_max_level}\n`;
  }

  if (giveaway.required_role_id) {
    reqDesc += `**Role:** You need the <@&${giveaway.required_role_id}> role\n`;
  }

  if (giveaway.required_boosting === true) {
    reqDesc += "**Server Boosting:** You must be a server booster\n";
  } else if (giveaway.required_boosting === false) {
    reqDesc += "**Server Boosting:** You must not be a server booster\n";
  }

  if (giveaway.required_nitro_state === "nitro") {
    reqDesc += "**Nitro:** You must have Discord Nitro\n";
  } else if (giveaway.required_nitro_state === "none") {
    reqDesc += "**Nitro:** You must __not__ have Discord Nitro\n";
  }

  if (reqDesc.length === 0) {
    reqDesc = "There are no requirements to enter this giveaway!";
  }

  if (!(giveaway.start_at instanceof Date)) {
    throw new Error("Giveaway start_at is not a Date");
  }

  return new EmbedBuilder()
    .setTitle(`Giveaway - ${giveaway.prize}`)
    .setDescription(desc)
    .addFields({
      name: "Requirements",
      value: reqDesc,
    })
    .setColor(Color.Info)
    .setTimestamp(giveaway.start_at);
}
