import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildEmoji,
  Collection,
} from "discord.js";
import Context from "../../model/context";
import { SlashCommandHandler } from "../handlers";
import db from "../../model/db";
import Color from "../../utils/colors";
import Paginator from "../../utils/Paginator";

enum GroupingOptions {
  Sum = "sum",
  Message = "message",
  Reaction = "reaction",
}

enum OrderOptions {
  HighToLow = "high_to_low",
  LowToHigh = "low_to_high",
}

// enum ServerOptions {
//   Sum = "sum",
//   Internal = "internal",
//   External = "external",
// }

type EmojiStat = {
  guild_id: string;
  asset_id: string;
  total_count: string;
};

async function getTotalEntries(
  interaction: ChatInputCommandInteraction,
  guildEmojis: Collection<string, GuildEmoji>,
  grouping: GroupingOptions
): Promise<number> {
  const res = await db
    .selectFrom("app_public.emoji_sticker_stats")
    .select((eb) => [
      eb.fn.count("app_public.emoji_sticker_stats.asset_id").as("count"),
    ])
    // Currently only show stats for emojis used in this server.
    .where("guild_id", "=", interaction.guildId)
    // Only emojis from this guild.
    // TODO: Deleted emojis will be unrecoverable.
    .where(
      "asset_id",
      "in",
      guildEmojis.map((e) => e.id)
    )
    // ---------------------
    // Specific types -- if not specified, adds both together
    .$if(grouping === GroupingOptions.Message, (q) =>
      q.where("action_type", "=", "message")
    )
    .$if(grouping === GroupingOptions.Reaction, (q) =>
      q.where("action_type", "=", "reaction")
    )
    .executeTakeFirstOrThrow();

  if (typeof res.count === "string") {
    return parseInt(res.count, 10);
  }

  if (typeof res.count === "bigint") {
    return Number(res.count);
  }

  return res.count;
}

async function getStatsPage(
  interaction: ChatInputCommandInteraction,
  guildEmojis: Collection<string, GuildEmoji>,
  pageNum: number,
  pageSize: number,
  grouping: GroupingOptions,
  order: OrderOptions
): Promise<string> {
  const values = await db
    .selectFrom("app_public.emoji_sticker_stats")
    .select((eb) => [
      "asset_id",
      "guild_id",
      eb.fn<string>("sum", ["count"]).as("total_count"),
    ])
    // Currently only show stats for emojis used in this server.
    // TODO: Add support for showing use outside of the server, it will only
    // show emojis for this guild in the list still as we filter by emoji ids
    // from this guild.
    .where("guild_id", "=", interaction.guildId)
    // Only emojis from this guild.
    // TODO: Deleted emojis will be unrecoverable.
    .where(
      "asset_id",
      "in",
      guildEmojis.map((e) => e.id)
    )
    // ---------------------
    // Specific types -- if not specified, adds both together
    .$if(grouping === GroupingOptions.Message, (q) =>
      q.where("action_type", "=", "message")
    )
    .$if(grouping === GroupingOptions.Reaction, (q) =>
      q.where("action_type", "=", "reaction")
    )
    // Want to see emojis used in the same server and outside separately
    .groupBy(["asset_id", "guild_id"])
    // ---------------------
    // Order by total_count
    .$if(order === OrderOptions.HighToLow, (q) =>
      q.orderBy("total_count", "desc")
    )
    .$if(order === OrderOptions.LowToHigh, (q) =>
      q.orderBy("total_count", "asc")
    )
    .limit(pageSize)
    .offset(pageNum * pageSize)
    .execute();

  const formatStat = (v: EmojiStat): string => {
    const emoji = guildEmojis.get(v.asset_id);
    if (!emoji) {
      return `ID \`${v.asset_id}\` (not found) - \`${v.total_count}\``;
    }

    return `${emoji} - \`${v.total_count}\``;
  };

  return values.map(formatStat).join("\n");
}

export default class EmojiStatsCommand extends SlashCommandHandler {
  command = new SlashCommandBuilder()
    .setName("emojistats")
    .setDescription("Get stats for server emoji use.")
    .setDMPermission(false)
    .addStringOption((o) =>
      o
        .setName("grouping")
        .setDescription(
          "Do you want to see a sum of emojis used in messages and reactions, or separately?"
        )
        .addChoices(
          {
            name: "Sum: Show sum for both messages and reactions",
            value: GroupingOptions.Sum,
          },
          {
            name: "Messages only: Show emojis used in messages only",
            value: GroupingOptions.Message,
          },
          {
            name: "Reactions only: Show emojis used in reactions only",
            value: GroupingOptions.Reaction,
          }
        )
    )
    .addStringOption((o) =>
      o
        .setName("order")
        .setDescription(
          "What order do you want to see the stats in? (default: most used first)"
        )
        .addChoices(
          {
            name: "High to low: Most used first",
            value: OrderOptions.HighToLow,
          },
          {
            name: "Low to high: Least used first",
            value: OrderOptions.LowToHigh,
          }
        )
    )
    // .addStringOption((o) =>
    //   o
    //     .setName("filter_server")
    //     .setDescription("Filter by which server emojis are used in")
    //     .addChoices(
    //       {
    //         name: "Sum: Show total for usage in any servers sushii is in",
    //         value: ServerOptions.Sum,
    //       },
    //       {
    //         name: "Only show the stats for emojis used in THIS server",
    //         value: ServerOptions.Internal,
    //       },
    //       {
    //         name: "Only show the stats for emojis used in OTHER servers",
    //         value: ServerOptions.External,
    //       }
    //     )
    // )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Not in cached guild");
    }

    const guildEmojis = await interaction.guild.emojis.fetch();

    const order = (interaction.options.getString("order") ||
      OrderOptions.HighToLow) as OrderOptions;

    const grouping = (interaction.options.getString("grouping") ||
      GroupingOptions.Sum) as GroupingOptions;

    const addEmbedOptions = (eb: EmbedBuilder): EmbedBuilder => {
      eb.setColor(Color.Info);

      switch (order) {
        case OrderOptions.HighToLow:
          eb.setFooter({
            text: "Showing most used first",
          });

          break;
        case OrderOptions.LowToHigh:
          eb.setFooter({
            text: "Showing least used first",
          });
          break;
        default:
          break;
      }

      switch (grouping) {
        case GroupingOptions.Sum:
          eb.setTitle("Emoji Stats - Total for both messages and reactions");
          break;
        case GroupingOptions.Message:
          eb.setTitle("Emoji Stats - Messages only");
          break;
        case GroupingOptions.Reaction:
          eb.setTitle("Emoji Stats - Reactions only");
          break;
        default:
          break;
      }

      return eb;
    };

    const paginator = new Paginator({
      interaction,
      getPageFn: (pageNum, pageSize) =>
        getStatsPage(
          interaction,
          guildEmojis,
          pageNum,
          pageSize,
          grouping,
          order
        ),
      getTotalEntriesFn: async () =>
        getTotalEntries(interaction, guildEmojis, grouping),
      pageSize: 25,
      embedModifierFn: addEmbedOptions,
    });

    await paginator.paginate();
  }
}
