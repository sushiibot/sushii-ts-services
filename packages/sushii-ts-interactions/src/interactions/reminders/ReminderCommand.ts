import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import {
  APIChatInputApplicationCommandGuildInteraction,
  MessageFlags,
} from "discord-api-types/v10";
import { t } from "i18next";
import Context from "../../model/context";
import Color from "../../utils/colors";
import { isNoValuesDeletedError } from "../../utils/graphqlError";
import getInvokerUser from "../../utils/interactions";
import parseDuration from "../../utils/parseDuration";
import { SlashCommandHandler } from "../handlers";
import CommandInteractionOptionResolver from "../resolver";

export default class ReminderCommand extends SlashCommandHandler {
  serverOnly = true;

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
            .setRequired(true)
        )
        .addStringOption((o) =>
          o
            .setName("description")
            .setDescription("Description of the reminder.")
            .setRequired(true)
        )
    )
    .addSubcommand((c) =>
      c.setName("list").setDescription("List all of your pending reminders.")
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
            .setAutocomplete(true)
        )
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction
  ): Promise<void> {
    const options = new CommandInteractionOptionResolver(
      interaction.data.options,
      interaction.data.resolved
    );

    const subcommand = options.getSubcommand();
    switch (subcommand) {
      case "add":
        return ReminderCommand.addHandler(ctx, interaction, options);
      case "list":
        return ReminderCommand.listHandler(ctx, interaction);
      case "delete":
        return ReminderCommand.deleteHandler(ctx, interaction, options);

      default:
        throw new Error("Invalid subcommand.");
    }
  }

  static async addHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const durationStr = options.getString("duration");
    if (!durationStr) {
      throw new Error("Missing duration.");
    }

    const description = options.getString("description");
    if (!description) {
      throw new Error("Missing description");
    }

    const invoker = getInvokerUser(interaction);

    const duration = parseDuration(durationStr);
    if (!duration) {
      await ctx.REST.interactionReply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setTitle(
              t("reminder.add.error.invalid_duration_title", { ns: "commands" })
            )
            .setDescription(
              t("reminder.add.error.invalid_duration_description", {
                ns: "commands",
              })
            )
            .setColor(Color.Error)
            .toJSON(),
        ],
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    const expireAt = dayjs().utc().add(duration);

    await ctx.sushiiAPI.sdk.createReminder({
      reminder: {
        userId: invoker.id,
        description,
        setAt: dayjs().utc().toISOString(),
        expireAt: expireAt.toISOString(),
      },
    });

    const embed = new EmbedBuilder()
      .setTitle(t("reminder.add.success.title", { ns: "commands" }))
      .setDescription(
        t("reminder.add.success.description", {
          ns: "commands",
          expireAtTimestamp: expireAt.unix(),
          description,
        })
      )
      .setColor(Color.Success);

    await ctx.REST.interactionReply(interaction, {
      embeds: [embed.toJSON()],
      flags: MessageFlags.Ephemeral,
    });
  }

  static async listHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction
  ): Promise<void> {
    const invoker = getInvokerUser(interaction);

    const reminders = await ctx.sushiiAPI.sdk.getUserReminders({
      userId: invoker.id,
    });

    const remindersStr = reminders.allReminders?.nodes.map((r) => {
      const expireAtTimestamp = dayjs.utc(r.expireAt);
      return `<t:${expireAtTimestamp.unix()}:R> - ${r.description}`;
    });

    if (!remindersStr || remindersStr.length === 0) {
      await ctx.REST.interactionReply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setTitle(
              t("reminder.list.success.empty_title", { ns: "commands" })
            )
            .setDescription(
              t("reminder.list.success.empty_description", { ns: "commands" })
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

    await ctx.REST.interactionReply(interaction, {
      embeds: [embed.toJSON()],
      flags: MessageFlags.Ephemeral,
    });
  }

  static async deleteHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const reminder = options.getString("reminder");
    if (!reminder) {
      throw new Error("Missing reminder.");
    }

    const invoker = getInvokerUser(interaction);

    let deletedReminder;

    try {
      const r = await ctx.sushiiAPI.sdk.deleteReminder({
        userId: invoker.id,
        setAt: reminder,
      });

      deletedReminder = r.deleteReminderByUserIdAndSetAt?.reminder;
    } catch (err) {
      if (!isNoValuesDeletedError(err)) {
        throw err;
      }

      // Returns correct error
      await ctx.REST.interactionReply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setTitle(
              t("reminder.delete.error.not_found", {
                ns: "commands",
              })
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
          expireAtTimestamp: dayjs.utc(deletedReminder?.expireAt).unix(),
          description: deletedReminder?.description || "unknown",
        })
      )
      .setColor(Color.Success);

    await ctx.REST.interactionReply(interaction, {
      embeds: [embed.toJSON()],
      flags: MessageFlags.Ephemeral,
    });
  }
}
