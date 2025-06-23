import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import Context from "../../model/context";
import Color from "../../utils/colors";
import { SlashCommandHandler } from "../handlers";
import db from "../../model/db";
import Paginator, {
  EmbedModifierFn,
  GetPageFn,
  GetTotalEntriesFn,
} from "../../utils/Paginator";
import {
  getGuildLeaderboardPage,
  getUserGuildLevel,
  guildUserCountInTimeFrame,
  TimeFrameSchema,
  timeframeToString,
  userGuildTimeframeRank,
} from "../../db/UserLevel/UserLevel.repository";

export default class LeaderboardCommand extends SlashCommandHandler {
  command = new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Show the leaderboard for the server.")
    .setDMPermission(false)
    .addStringOption((o) =>
      o
        .setName("timeframe")
        .setDescription("The timeframe for the leaderboard.")
        .setRequired(false)
        .addChoices(
          {
            name: "Day",
            value: "day",
          },
          {
            name: "Week",
            value: "week",
          },
          {
            name: "Month",
            value: "month",
          },
          {
            name: "All Time",
            value: "all_time",
          },
        ),
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Guild not cached");
    }

    const timeframeRaw =
      interaction.options.getString("timeframe") ?? "all_time";
    const timeframe = TimeFrameSchema.safeParse(timeframeRaw);
    if (!timeframe.success) {
      throw new Error("Invalid timeframe");
    }

    const userGuildRank = await userGuildTimeframeRank(
      db,
      interaction.guildId,
      interaction.user.id,
      timeframe.data,
    );
    const userGuildLevel = await getUserGuildLevel(
      db,
      interaction.guildId,
      interaction.user.id,
    );

    const getPageFn: GetPageFn = async (pageIndex, pageSize) => {
      const pageData = await getGuildLeaderboardPage(
        db,
        interaction.guildId,
        timeframe.data,
        pageIndex,
        pageSize,
      );

      let desc = "";

      let foundUser = false;
      for (const row of pageData) {
        desc += `\`${row.rank}.\` <@${row.user_id}>`;
        desc += "\n";
        desc += `\u200B\u2003╰ Level ${row.level}`;
        desc += "\n";

        if (row.user_id === interaction.user.id) {
          foundUser = true;
        }
      }

      if (!foundUser && userGuildRank && userGuildLevel) {
        desc += "~~---~~\n";
        desc += `\`${userGuildRank.rank}.\` <@${userGuildLevel.user_id}>: Level ${userGuildLevel.level}`;
        desc += "\n";
      }

      return desc;
    };

    const getTotalEntriesFn: GetTotalEntriesFn = () =>
      guildUserCountInTimeFrame(db, interaction.guildId, timeframe.data);

    const embedModifierFn: EmbedModifierFn = (embed) =>
      embed
        .setTitle(`Server Leaderboard - ${timeframeToString(timeframe.data)}`)
        .setColor(Color.Info);

    const paginator = new Paginator({
      interaction,
      getPageFn,
      getTotalEntriesFn,
      pageSize: 10,
      embedModifierFn,
    });

    await paginator.paginate();
  }
}
