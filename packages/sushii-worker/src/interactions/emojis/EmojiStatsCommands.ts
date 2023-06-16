import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import Context from "../../model/context";
import { SlashCommandHandler } from "../handlers";
import db from "../../model/db";
import Color from "../../utils/colors";
import { AppPublicEmojiStickerActionType } from "../../model/dbTypes";

enum GroupingOptions {
  Sum = "sum",
  Separate = "separate",
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
  action_type: AppPublicEmojiStickerActionType;
  total_count: string;
};

type EmojiStatSum = {
  guild_id: string;
  asset_id: string;
  total_count: number;
};

export default class EmojiStatsCommand extends SlashCommandHandler {
  command = new SlashCommandBuilder()
    .setName("emojistats")
    .setDescription("Get stats for server emoji use.")
    .setDMPermission(false)
    .addStringOption((o) =>
      o
        .setName("grouping")
        .setDescription(
          "Do you want to see the sum of messages and reactions, or separately?"
        )
        .addChoices(
          {
            name: "Sum: Show sum for both messages and reactions",
            value: GroupingOptions.Sum,
          },
          {
            name: "Separate: Show message and reaction counts separately",
            value: GroupingOptions.Separate,
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

    const values = await db
      .selectFrom("app_public.emoji_sticker_stats")
      .select((eb) => [
        "asset_id",
        "guild_id",
        eb.fn<string>("sum", ["count"]).as("total_count"),
        "action_type",
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
      // Want to see emojis used in the same server and outside separately
      .groupBy(["asset_id", "guild_id", "action_type"])
      .orderBy("total_count", "desc")
      .execute();

    if (values.length === 0) {
      const embed = new EmbedBuilder()
        .setTitle("Emoji Stats")
        .setColor(Color.Error)
        .setDescription(
          "No emoji stats found. Try again later when there are emojis used more."
        );

      await interaction.reply({
        embeds: [embed],
      });

      return;
    }

    const order = interaction.options.getString("order") as
      | OrderOptions
      | undefined;

    const grouping = interaction.options.getString("grouping") as
      | GroupingOptions
      | undefined;

    if (grouping === GroupingOptions.Sum) {
      const sumValues = values
        .map((v) => ({
          ...v,
          total_count: parseInt(v.total_count, 10),
        }))
        .reduce((acc, curr) => {
          let v = acc.get(curr.asset_id);
          if (!v) {
            v = {
              asset_id: curr.asset_id,
              guild_id: curr.guild_id,
              total_count: 0,
            };
          }

          v.total_count += curr.total_count;
          acc.set(curr.asset_id, v);

          return acc;
        }, new Map<string, EmojiStatSum>());

      // Sort sumValues by total_count
      const sortedSumValues = Array.from(sumValues.values()).sort(
        (a, b) => b.total_count - a.total_count
      );

      if (order === OrderOptions.LowToHigh) {
        sortedSumValues.reverse();
      }

      const desc = sortedSumValues.map((v) => {
        const emoji = guildEmojis.get(v.asset_id);
        if (!emoji) {
          return `ID \`${v.asset_id}\` (not found): ${v.total_count}`;
        }

        return `${emoji} - \`${v.total_count}\``;
      });

      const embed = new EmbedBuilder()
        .setTitle("Emoji Stats - Sum of messages and reactions")
        .setColor(Color.Info)
        .setDescription(desc.join("\n"));

      await interaction.reply({
        embeds: [embed],
      });

      return;
    }

    const formatStat = (v: EmojiStat): string => {
      const emoji = guildEmojis.get(v.asset_id);
      if (!emoji) {
        return `ID \`${v.asset_id}\` (not found) (${v.action_type}): ${v.total_count}`;
      }

      return `${emoji} - \`${v.total_count}\``;
    };

    const messageValues = values
      .filter((v) => v.action_type === "message")
      .map(formatStat);

    const reactionValues = values
      .filter((v) => v.action_type === "reaction")
      .map(formatStat);

    if (order === OrderOptions.LowToHigh) {
      messageValues.reverse();
      reactionValues.reverse();
    }

    const embed = new EmbedBuilder()
      .setTitle("Emoji Stats - Separately for messages and reactions")
      .setColor(Color.Info)
      .addFields(
        {
          name: "Messages",
          value: messageValues.join("\n") || "None",
        },
        {
          name: "Reactions",
          value: reactionValues.join("\n") || "None",
        }
      );

    await interaction.reply({
      embeds: [embed],
    });
  }
}
