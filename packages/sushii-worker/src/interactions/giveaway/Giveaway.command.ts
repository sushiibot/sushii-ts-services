import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  messageLink,
  MessageFlags,
  DiscordAPIError,
  RESTJSONErrorCodes,
  InteractionContextType,
} from "discord.js";
import dayjs from "dayjs";
import Context from "../../model/context";
import { SlashCommandHandler } from "../handlers";
import { getErrorMessage } from "../responses/error";
import {
  createGiveaway,
  deleteGiveaway,
  getAllActiveGiveaways,
  getGiveaway,
  markGiveawayAsEnded,
} from "../../db/Giveaway/Giveaway.repository";
import db from "../../infrastructure/database/db";
import parseDuration from "../../utils/parseDuration";
import Color from "../../utils/colors";
import {
  endGiveaway,
  getGiveawayChannelFromInteraction,
  updateGiveawayMessage,
} from "./Giveaway.service";
import { getGiveawayComponents } from "./Giveaway.components";
import { getGiveawayEmbed } from "./Giveaway.embed";
import { InsertableGiveawayRow } from "../../db/Giveaway/Giveaway.table";
import toTimestamp from "../../utils/toTimestamp";
import { GiveawayOption } from "./Giveaway.options";

export enum GiveawaySubcommand {
  Create = "create",
  List = "list",
  Delete = "delete",
  End = "end",
  Reroll = "reroll",
}

export default class GiveawayCommand extends SlashCommandHandler {
  command = new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Host giveaways in your server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setContexts(InteractionContextType.Guild)
    .addSubcommand((c) =>
      c
        .setName(GiveawaySubcommand.Create)
        .setDescription("Create a new giveaway.")
        .addStringOption((o) =>
          o
            .setName(GiveawayOption.Duration)
            .setDescription("How long before winners are picked?")
            .setRequired(true),
        )
        .addNumberOption((o) =>
          o
            .setName(GiveawayOption.Winners)
            .setDescription("How people can win?")
            .setRequired(true),
        )
        .addStringOption((o) =>
          o
            .setName(GiveawayOption.Prize)
            .setDescription("What do winners win?")
            .setRequired(true),
        )
        .addRoleOption((o) =>
          o
            .setName(GiveawayOption.RequiredRole)
            .setDescription("Role required to enter.")
            .setRequired(false),
        )
        .addNumberOption((o) =>
          o
            .setName(GiveawayOption.RequiredMinLevel)
            .setDescription("Minimum level required to enter.")
            .setMinValue(1)
            .setRequired(false),
        )
        .addNumberOption((o) =>
          o
            .setName(GiveawayOption.RequiredMaxLevel)
            .setDescription("Maximum level required to enter.")
            .setMinValue(2)
            .setRequired(false),
        )
        // .addStringOption((o) =>
        //   o
        //     .setName(GiveawayOption.RequiredNitroState)
        //     .setDescription(
        //       "Require no Nitro to enter or the other way around.",
        //     )
        //     .addChoices(
        //       {
        //         name: "No Nitro - Require user to have no Nitro to enter",
        //         value: "none",
        //       },
        //       {
        //         name: "Nitro - Require user to have Nitro to enter",
        //         value: "nitro",
        //       },
        //     )
        //     .setRequired(false),
        // )
        .addBooleanOption((o) =>
          o
            .setName(GiveawayOption.BoosterStatus)
            .setDescription(
              "Require server boosting to enter or the other way around.",
            )
            .setRequired(false),
        ),
    )
    .addSubcommand((c) =>
      c
        .setName(GiveawaySubcommand.Delete)
        .setDescription("Delete an active giveaway.")
        .addStringOption((o) =>
          o
            .setName(GiveawayOption.GiveawayID)
            .setDescription("ID of the giveaway to delete.")
            .setAutocomplete(true)
            .setRequired(true),
        ),
    )
    .addSubcommand((c) =>
      c
        .setName(GiveawaySubcommand.List)
        .setDescription("List all active giveaways in this server."),
    )
    .addSubcommand((c) =>
      c
        .setName(GiveawaySubcommand.End)
        .setDescription("Immediately end and pick the winners for a giveaway.")
        .addStringOption((o) =>
          o
            .setName(GiveawayOption.GiveawayID)
            .setDescription("ID of the giveaway to end.")
            .setAutocomplete(true)
            .setRequired(true),
        ),
    )
    .addSubcommand((c) =>
      c
        .setName(GiveawaySubcommand.Reroll)
        .setDescription("Pick one new winner for an ended giveaway.")
        .addStringOption((o) =>
          o
            .setName(GiveawayOption.GiveawayID)
            .setDescription("ID of the giveaway to reroll.")
            .setAutocomplete(true)
            .setRequired(true),
        )
        .addNumberOption((o) =>
          o
            .setName(GiveawayOption.Winners)
            .setDescription("How many new winners to pick? (default: 1)")
            .setRequired(false),
        )
        .addBooleanOption((o) =>
          o
            .setName(GiveawayOption.AllowRepeatWinners)
            .setDescription(
              "Allow previous winners to win again? (Default: no)",
            )
            .setRequired(false),
        ),
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Not in cached guild");
    }

    const subcommand = interaction.options.getSubcommand(true);
    switch (subcommand) {
      case GiveawaySubcommand.Create:
        await this.createGiveaway(ctx, interaction);
        break;
      case GiveawaySubcommand.List:
        await this.listGiveaways(ctx, interaction);
        break;
      case GiveawaySubcommand.Delete:
        await this.deleteGiveaway(ctx, interaction);
        break;
      case GiveawaySubcommand.End:
        await this.endGiveaway(ctx, interaction);
        break;
      case GiveawaySubcommand.Reroll:
        await this.rerollGiveaway(ctx, interaction);
        break;
      default:
        throw new Error("Invalid subcommand");
    }
  }

  private async createGiveaway(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const durationStr = interaction.options.getString(
      GiveawayOption.Duration,
      true,
    );
    const duration = parseDuration(durationStr);
    if (!duration) {
      await interaction.reply(
        getErrorMessage(
          "Invalid duration",
          "Please provide a valid duration. Examples: `1w` for 1 week, `1d` for 1 day, `1h` for 1 hour, `1d2h` for 1 day and 2 hours",
        ),
      );

      return;
    }

    const winners = interaction.options.getNumber(GiveawayOption.Winners, true);
    const prize = interaction.options.getString(GiveawayOption.Prize, true);
    const requiredRole = interaction.options.getRole(
      GiveawayOption.RequiredRole,
    );
    const requiredMinLevel = interaction.options.getNumber(
      GiveawayOption.RequiredMinLevel,
    );
    const requiredMaxLevel = interaction.options.getNumber(
      GiveawayOption.RequiredMaxLevel,
    );
    // const requiredNitroState = interaction.options.getString(
    //   GiveawayOption.RequiredNitroState,
    // );
    const boosterStatus = interaction.options.getBoolean(
      GiveawayOption.BoosterStatus,
    );

    if (!interaction.channel) {
      throw new Error("No channel");
    }

    const giveaway: InsertableGiveawayRow = {
      id: "DUMMY ID",
      channel_id: interaction.channelId,
      guild_id: interaction.guildId,
      host_user_id: interaction.user.id,
      num_winners: winners,
      prize,
      required_role_id: requiredRole?.id,
      required_min_level: requiredMinLevel,
      required_max_level: requiredMaxLevel,
      // required_nitro_state: requiredNitroState as AppPublicGiveawayNitroType,
      required_boosting: boosterStatus,
      start_at: dayjs.utc().toDate(),
      end_at: dayjs.utc().add(duration).toDate(),
    };

    const embed = getGiveawayEmbed(giveaway, []);
    const components = getGiveawayComponents(0, false);

    let giveawayMsg;
    try {
      giveawayMsg = await interaction.channel.send({
        embeds: [embed],
        components,
      });
    } catch (err) {
      if (err instanceof DiscordAPIError) {
        if (err.code === RESTJSONErrorCodes.MissingAccess) {
          await interaction.reply(
            getErrorMessage(
              "Failed to send giveaway",
              "I don't have permission to send the giveaway message, please make sure I can view and send messages to the channel.",
            ),
          );

          return;
        }
      }

      throw err;
    }

    try {
      await createGiveaway(db, {
        ...giveaway,
        // Actually set the ID to the message ID
        id: giveawayMsg.id,
      });
    } catch (err) {
      // Delete the message if we failed to create the giveaway
      await giveawayMsg.delete();
    }

    const responseEmbed = new EmbedBuilder()
      .setTitle("Giveaway created!")
      .setDescription(`You can find your giveaway [here](${giveawayMsg?.url}).`)
      .setColor(Color.Success);

    await interaction.reply({
      embeds: [responseEmbed],
      flags: MessageFlags.Ephemeral,
    });
  }

  private async listGiveaways(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    // All giveaways
    const giveaways = await getAllActiveGiveaways(
      db,
      interaction.guildId,
      null,
    );

    if (giveaways.length === 0) {
      const embed = new EmbedBuilder()
        .setTitle("No active giveaways")
        .setDescription("Create a new one with /giveaway create")
        .setColor(Color.Info);

      await interaction.reply({
        embeds: [embed],
      });

      return;
    }

    let desc = "";

    for (const giveaway of giveaways) {
      const endAt = dayjs.utc(giveaway.end_at);
      const fullTs = toTimestamp(endAt, "f");
      const relTs = toTimestamp(endAt, "R");

      const giveawayUrl = messageLink(
        giveaway.channel_id,
        giveaway.id,
        interaction.guildId,
      );

      desc += `**ID:** [\`${giveaway.id}\`](${giveawayUrl})\n`;
      desc += `╰ Ending: ${relTs} ~ ${fullTs}\n`;
      desc += `╰ Prize: ${giveaway.prize}\n`;
      desc += `╰ Winners: ${giveaway.num_winners}\n`;
      desc += `╰ Host: <@${giveaway.host_user_id}>\n`;
    }

    const embed = new EmbedBuilder()
      .setTitle("Active giveaways")
      .setDescription(desc)
      .setColor(Color.Info);

    await interaction.reply({
      embeds: [embed],
    });
  }

  private async deleteGiveaway(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const giveawayId = interaction.options.getString(GiveawayOption.GiveawayID);
    if (!giveawayId) {
      throw new Error("No giveaway ID");
    }

    const deletedGiveaway = await deleteGiveaway(
      db,
      interaction.guildId,
      giveawayId,
    );
    if (!deletedGiveaway) {
      await interaction.reply(
        getErrorMessage("Giveaway not found", "Please give a giveaway ID."),
      );

      return;
    }

    const giveawayChannel = await getGiveawayChannelFromInteraction(
      interaction,
      deletedGiveaway,
    );

    // Delete the giveaway message
    await giveawayChannel.messages.delete(deletedGiveaway.id);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Giveaway deleted!")
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }

  private async endGiveaway(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const giveawayId = interaction.options.getString(
      GiveawayOption.GiveawayID,
      true,
    );
    const winnerCount = interaction.options.getNumber(GiveawayOption.Winners);
    const allowRepeatWinners = interaction.options.getBoolean(
      GiveawayOption.AllowRepeatWinners,
    );

    const giveaway = await getGiveaway(db, interaction.guildId, giveawayId);
    if (!giveaway) {
      await interaction.reply(
        getErrorMessage("Giveaway not found", "Please give a giveaway ID."),
      );

      return;
    }

    if (giveaway.is_ended) {
      await interaction.reply(
        getErrorMessage(
          "Giveaway already ended",
          "This giveaway has already ended. You can reroll it with `/giveaway reroll`.",
        ),
      );

      return;
    }

    const giveawayChannel = await getGiveawayChannelFromInteraction(
      interaction,
      giveaway,
    );
    const { embed, winnerIds } = await endGiveaway(
      giveawayChannel,
      giveawayId,
      giveaway,
      allowRepeatWinners || false,
      winnerCount || 1,
    );

    await markGiveawayAsEnded(db, giveawayId);

    if (embed) {
      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });

      return;
    }

    await updateGiveawayMessage(giveawayChannel, giveaway, winnerIds);

    const responseEmbed = new EmbedBuilder()
      .setTitle("Ended giveaway")
      .setColor(Color.Success);

    await interaction.reply({
      embeds: [responseEmbed],
      flags: MessageFlags.Ephemeral,
    });
  }

  private async rerollGiveaway(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const giveawayId = interaction.options.getString(
      GiveawayOption.GiveawayID,
      true,
    );
    const winnerCount = interaction.options.getNumber(GiveawayOption.Winners);
    const allowRepeatWinners = interaction.options.getBoolean(
      GiveawayOption.AllowRepeatWinners,
    );

    const giveaway = await getGiveaway(db, interaction.guildId, giveawayId);
    if (!giveaway) {
      await interaction.reply(
        getErrorMessage(
          "Giveaway not found",
          "Please give a giveaway ID.",
          true,
        ),
      );

      return;
    }

    if (!giveaway.is_ended) {
      await interaction.reply(
        getErrorMessage(
          "Giveaway not ended",
          "This giveaway has not ended yet. You can end it with `/giveaway end`.",
          true,
        ),
      );

      return;
    }

    const giveawayChannel = await getGiveawayChannelFromInteraction(
      interaction,
      giveaway,
    );
    const { embed } = await endGiveaway(
      giveawayChannel,
      giveawayId,
      giveaway,
      allowRepeatWinners || false,
      winnerCount || 1,
    );

    if (embed) {
      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });

      return;
    }

    // No updating of original giveaway message, only new one via endGiveaway

    const responseEmbed = new EmbedBuilder()
      .setTitle("Giveaway rerolled!")
      .setColor(Color.Success);

    await interaction.reply({
      embeds: [responseEmbed],
      flags: MessageFlags.Ephemeral,
    });
  }
}
