import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildEmoji,
  Sticker,
  Collection,
} from "discord.js";
import Context from "../../model/context";
import { SlashCommandHandler } from "../handlers";
import db from "../../model/db";
import Color from "../../utils/colors";
import Paginator from "../../utils/Paginator";
import logger from "../../logger";
import { AppPublicGuildAssetType } from "../../model/dbTypes";

enum CommandOption {
  Type = "type",
  Group = "group",
  Order = "order",
  Server = "server",
}

enum GroupOption {
  Sum = "sum",
  Message = "message",
  Reaction = "reaction",
}

enum OrderOption {
  HighToLow = "high_to_low",
  LowToHigh = "low_to_high",
}

enum ServerOption {
  Sum = "sum",
  Internal = "internal",
  External = "external",
}

enum AssetTypeOption {
  EmojiOnly = "emoji",
  StickerOnly = "sticker",
  Both = "both",
}

type EmojiStat = {
  asset_id: string;
  total_count?: string | number | bigint;
  name: string;
  type: AppPublicGuildAssetType;
};

type RequestOptions = {
  group: GroupOption;
  order: OrderOption;
  server: ServerOption;
  assetType: AssetTypeOption;
};

async function getAllStats(
  interaction: ChatInputCommandInteraction,
  guildEmojis: Collection<string, GuildEmoji>,
  guildStickers: Collection<string, Sticker>,
  { group, order, server, assetType }: RequestOptions
): Promise<string[]> {
  let query = db
    .selectFrom("app_public.emoji_sticker_stats")
    // Right join, since we want to exclude the items that are missing from the emoji/sticker table
    .innerJoin(
      "app_public.guild_emojis_and_stickers",
      "app_public.emoji_sticker_stats.asset_id",
      "app_public.guild_emojis_and_stickers.id"
    )
    .select(["asset_id", "type", "name"])
    // ---------------------
    // Specific servers -- if not specified, only internal
    // Includes where clause for the count in order to exclude 0 counts
    // This uses $if since we need it for the total_count alias to work later
    .$if(server === ServerOption.Internal, (q) =>
      q
        .select((eb) => eb.fn.sum("count").as("total_count"))
        .where("count", ">", "0")
    )
    .$if(server === ServerOption.External, (q) =>
      q
        .select((eb) => eb.fn.sum("count_external").as("total_count"))
        .where("count_external", ">", "0")
    )
    .$if(server === ServerOption.Sum, (q) =>
      q.select((eb) =>
        eb.fn
          .sum(eb.bxp("count", "+", eb.ref("count_external")))
          .as("total_count")
      )
    )
    // Limit by emojis from this guild, specifying the emoji/sticker table, not metrics.
    // This may include deleted expressions.
    .where(
      "app_public.guild_emojis_and_stickers.guild_id",
      "=",
      interaction.guildId
    )
    .groupBy(["asset_id", "type", "name"]);

  switch (assetType) {
    case AssetTypeOption.EmojiOnly: {
      query = query.where(
        "app_public.guild_emojis_and_stickers.type",
        "=",
        "emoji"
      );
      break;
    }
    case AssetTypeOption.StickerOnly: {
      query = query.where(
        "app_public.guild_emojis_and_stickers.type",
        "=",
        "sticker"
      );
      break;
    }
    case AssetTypeOption.Both: {
      // do nothing
      break;
    }
  }

  // ---------------------
  // Specific types -- if not specified, adds both together
  switch (group) {
    case GroupOption.Message: {
      query = query.where("action_type", "=", "message");
      break;
    }
    case GroupOption.Reaction: {
      query = query.where("action_type", "=", "reaction");
      break;
    }
    case GroupOption.Sum: {
      break;
    }
  }

  // ---------------------
  // Order by total_count
  switch (order) {
    case OrderOption.HighToLow: {
      query = query.orderBy("total_count", "desc");
      break;
    }
    case OrderOption.LowToHigh: {
      query = query.orderBy("total_count", "asc");
      break;
    }
  }

  const values = await query
    // Secondary sort so it's consistent
    .orderBy("asset_id")
    // Exclude 0 counts, e.g. used internal but not external
    .execute();

  logger.debug(
    {
      valueLength: values.length,
    },
    "getStatsPage"
  );

  const formatStat = (v: EmojiStat): string => {
    const totalCount = v.total_count || "0";

    if (v.type === "emoji") {
      const emoji = guildEmojis.get(v.asset_id);
      if (!emoji) {
        return `\`${v.name}\` (ID \`${v.asset_id}\`) not found - \`${totalCount}\``;
      }

      return `${emoji} - \`${totalCount}\``;
    }

    const sticker = guildStickers.get(v.asset_id);
    if (!sticker) {
      return `\`${v.name}\` (ID \`${v.asset_id}\`) not found - \`${totalCount}\``;
    }

    return `${sticker.name} - \`${totalCount}\` (sticker)`;
  };

  return values.map(formatStat);
}

export default class EmojiStatsCommand extends SlashCommandHandler {
  command = new SlashCommandBuilder()
    .setName("emojistats")
    .setDescription("Get stats for server emoji use.")
    .setDMPermission(false)
    .addStringOption((o) =>
      o
        .setName(CommandOption.Group)
        .setDescription(
          "Do you want to see a sum of emojis used in messages and reactions, or separately?"
        )
        .addChoices(
          {
            name: "Sum: Show sum for both messages and reactions",
            value: GroupOption.Sum,
          },
          {
            name: "Messages only: Show emojis used in messages only",
            value: GroupOption.Message,
          },
          {
            name: "Reactions only: Show emojis used in reactions only",
            value: GroupOption.Reaction,
          }
        )
    )
    .addStringOption((o) =>
      o
        .setName(CommandOption.Type)
        .setDescription(
          "Do you want to see Emojis or Stickers? (default: Emojis)"
        )
        .addChoices(
          {
            name: "Emojis Only: Show emojis only",
            value: AssetTypeOption.EmojiOnly,
          },
          {
            name: "Stickers only: Show stickers only",
            value: AssetTypeOption.StickerOnly,
          },
          {
            name: "Both: Show both emojis and stickers",
            value: AssetTypeOption.Both,
          }
        )
    )
    .addStringOption((o) =>
      o
        .setName(CommandOption.Order)
        .setDescription(
          "What order do you want to see the stats in? (default: Most used first)"
        )
        .addChoices(
          {
            name: "High to low: Most used first",
            value: OrderOption.HighToLow,
          },
          {
            name: "Low to high: Least used first",
            value: OrderOption.LowToHigh,
          }
        )
    )
    .addStringOption((o) =>
      o
        .setName(CommandOption.Server)
        .setDescription(
          "Show emoji use in this server or others? (default: Only this server)"
        )
        .addChoices(
          {
            name: "Sum: Total count of emojis in ALL servers sushii is in",
            value: ServerOption.Sum,
          },
          {
            name: "This server: Only count emojis used in THIS server",
            value: ServerOption.Internal,
          },
          {
            name: "Other servers: Only count emojis used in OTHER servers",
            value: ServerOption.External,
          }
        )
    )
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
    const guildStickers = await interaction.guild.stickers.fetch();

    const order = (interaction.options.getString(CommandOption.Order) ||
      OrderOption.HighToLow) as OrderOption;

    const group = (interaction.options.getString(CommandOption.Group) ||
      GroupOption.Sum) as GroupOption;

    const server = (interaction.options.getString(CommandOption.Server) ||
      ServerOption.Internal) as ServerOption;

    const assetType = (interaction.options.getString(CommandOption.Type) ||
      AssetTypeOption.EmojiOnly) as AssetTypeOption;

    logger.debug(
      {
        order,
        group,
        server,
        assetType,
      },
      "emojistats options"
    );

    if (assetType === AssetTypeOption.EmojiOnly && guildEmojis.size === 0) {
      const embed = new EmbedBuilder()
        .setTitle("Emoji Stats")
        .setDescription("No emojis found in this server. Add some first!")
        .setColor(Color.Info);

      await interaction.reply({
        embeds: [embed],
      });

      return;
    }

    if (assetType === AssetTypeOption.StickerOnly && guildStickers.size === 0) {
      const embed = new EmbedBuilder()
        .setTitle("Sticker Stats")
        .setDescription("No stickers found in this server. Add some first!")
        .setColor(Color.Info);

      await interaction.reply({
        embeds: [embed],
      });

      return;
    }

    if (
      assetType === AssetTypeOption.Both &&
      guildEmojis.size === 0 &&
      guildStickers.size === 0
    ) {
      const embed = new EmbedBuilder()
        .setTitle("Emoji and Sticker Stats")
        .setDescription(
          "No emojis or stickers found in this server. Add some first!"
        )
        .setColor(Color.Info);

      await interaction.reply({
        embeds: [embed],
      });

      return;
    }

    const allStats = await getAllStats(
      interaction,
      guildEmojis,
      guildStickers,
      {
        group,
        order,
        server,
        assetType,
      }
    );

    const addEmbedOptions = (eb: EmbedBuilder): EmbedBuilder => {
      eb.setColor(Color.Info);

      switch (order) {
        case OrderOption.HighToLow:
          eb.setFooter({
            text: "Most used first",
          });

          break;
        case OrderOption.LowToHigh:
          eb.setFooter({
            text: "Least used first",
          });
          break;
        default:
          break;
      }

      let assetTypeText;
      switch (assetType) {
        case AssetTypeOption.EmojiOnly:
          assetTypeText = "Emoji Stats";
          break;
        case AssetTypeOption.StickerOnly:
          assetTypeText = "Sticker Stats";
          break;
        case AssetTypeOption.Both:
          assetTypeText = "Emoji and Sticker Stats";
          break;
      }

      eb.setAuthor({
        name: assetTypeText,
      });

      let title = "";

      switch (group) {
        case GroupOption.Sum:
          title = "Total messages + reactions";
          break;
        case GroupOption.Message:
          title = "Messages only";
          break;
        case GroupOption.Reaction:
          title = "Reactions only";
          break;
        default:
          throw new Error(`Invalid grouping option ${group}`);
      }

      switch (server) {
        case ServerOption.Sum:
          title += " | All servers";
          break;
        case ServerOption.Internal:
          title += " | This server";
          break;
        case ServerOption.External:
          title += " | Other servers";
          break;
        default:
          throw new Error(`Invalid server option ${server}`);
      }

      eb.setTitle(title);

      return eb;
    };

    const paginator = new Paginator({
      interaction,
      getPageFn: async (pageNum, pageSize) =>
        allStats.slice(pageNum * pageSize, (pageNum + 1) * pageSize).join("\n"),
      getTotalEntriesFn: async () => allStats.length,
      pageSize: 25,
      embedModifierFn: addEmbedOptions,
    });

    await paginator.paginate();
  }
}
