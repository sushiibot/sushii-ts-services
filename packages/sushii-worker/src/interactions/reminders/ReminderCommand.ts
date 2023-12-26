import {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags,
  ChatInputCommandInteraction,
} from "discord.js";
import dayjs from "dayjs";
import { t } from "i18next";
import Context from "../../model/context";
import Color from "../../utils/colors";
import parseDuration from "../../utils/parseDuration";
import { SlashCommandHandler } from "../handlers";
import { interactionReplyErrorPlainMessage } from "../responses/error";
import {
  deleteReminder,
  insertReminder,
  listReminders,
} from "../../db/Reminder/Reminder.repository";
import db from "../../model/db";

export default class ReminderCommand extends SlashCommandHandler {
  serverOnly = false;

  command = new SlashCommandBuilder()
    .setName("reminder")
    .setDescription("Set reminders for the future.")
    .addSubcommand((c) =>
      c
        .setName("add")
        .setDescription("Set a new reminder.")
        .addStringOption((o) =>
          o
            .setName("duration")
            .setDescription("When in the future to remind you.")
            .setRequired(true),
        )
        .addStringOption((o) =>
          o
            .setName("description")
            .setDescription("Description of the reminder.")
            .setRequired(true),
        ),
    )
    .addSubcommand((c) =>
      c.setName("list").setDescription("List all of your pending reminders."),
    )
    .addSubcommand((c) =>
      c
        .setName("delete")
        .setDescription("Delete a reminder.")
        .addStringOption((o) =>
          o
            .setName("reminder")
            .setDescription("Which reminder to delete.")
            .setRequired(true)
            .setAutocomplete(true),
        ),
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "add":
        return ReminderCommand.addHandler(ctx, interaction);
      case "list":
        return ReminderCommand.listHandler(ctx, interaction);
      case "delete":
        return ReminderCommand.deleteHandler(ctx, interaction);

      default:
        throw new Error("Invalid subcommand.");
    }
  }

  static async addHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const durationStr = interaction.options.getString("duration", true);

    const description = interaction.options.getString("description", true);

    const duration = parseDuration(durationStr);
    if (!duration) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(
              t("reminder.add.error.invalid_duration_title", {
                ns: "commands",
              }),
            )
            .setDescription(
              t("reminder.add.error.invalid_duration_description", {
                ns: "commands",
              }),
            )
            .setColor(Color.Error)
            .toJSON(),
        ],
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    const expireAt = dayjs().utc().add(duration);

    await insertReminder(
      db,
      interaction.user.id,
      expireAt.toDate(),
      description,
    );

    const embed = new EmbedBuilder()
      .setTitle(t("reminder.add.success.title", { ns: "commands" }))
      .setDescription(
        t("reminder.add.success.description", {
          ns: "commands",
          expireAtTimestamp: expireAt.unix(),
          description,
        }),
      )
      .setColor(Color.Success);

    await interaction.reply({
      embeds: [embed.toJSON()],
      flags: MessageFlags.Ephemeral,
    });
  }

  static async listHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const reminders = await listReminders(db, interaction.user.id);

    const remindersStr = reminders.map((r) => {
      const expireAtTimestamp = dayjs.utc(r.expire_at);
      return `<t:${expireAtTimestamp.unix()}:R> - ${r.description}`;
    });

    if (!remindersStr || remindersStr.length === 0) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(
              t("reminder.list.success.empty_title", { ns: "commands" }),
            )
            .setDescription(
              t("reminder.list.success.empty_description", { ns: "commands" }),
            )
            .setColor(Color.Success)
            .toJSON(),
        ],
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(t("reminder.list.success.title", { ns: "commands" }))
      .setDescription(remindersStr.join("\n"))
      .setColor(Color.Info);

    await interaction.reply({
      embeds: [embed.toJSON()],
      flags: MessageFlags.Ephemeral,
    });
  }

  static async deleteHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const reminder = interaction.options.getString("reminder", true);
    const reminderDate = dayjs.utc(reminder);

    if (!reminderDate.isValid()) {
      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        "Invalid reminder, please select a reminder from the autocomplete list!",
        true,
      );

      return;
    }

    const deletedReminder = await deleteReminder(
      db,
      interaction.user.id,
      reminderDate.toDate(),
    );

    if (!deletedReminder) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(
              t("reminder.delete.error.not_found", {
                ns: "commands",
              }),
            )
            .setColor(Color.Warning)
            .toJSON(),
        ],
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(t("reminder.delete.success.title", { ns: "commands" }))
      .setDescription(
        t("reminder.delete.success.description", {
          ns: "commands",
          expireAtTimestamp: dayjs.utc(deletedReminder?.expire_at).unix(),
          description: deletedReminder?.description || "unknown",
        }),
      )
      .setColor(Color.Success);

    await interaction.reply({
      embeds: [embed.toJSON()],
      flags: MessageFlags.Ephemeral,
    });
  }
}
