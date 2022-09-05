import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import {
  APIChatInputApplicationCommandGuildInteraction,
  MessageFlags,
  PermissionFlagsBits,
} from "discord-api-types/v10";
import CommandInteractionOptionResolver from "../resolver";
import Context from "../../model/context";
import { SlashCommandHandler } from "../handlers";
import { interactionReplyErrorMessage } from "../responses/error";
import Color from "../../utils/colors";

const RE_MESSAGE_ID = /^\d{17,21}$/;
const RE_MESSAGE_ID_FROM_URL = /channels\/\d{17,21}\/\d{17,21}\/(\d{17,21})$/;

function getMessageIDFromURL(url: string): string | null {
  const match = url.match(RE_MESSAGE_ID_FROM_URL);
  if (!match) {
    return null;
  }

  return match[1];
}

function getMessageIDPlain(id: string): string | null {
  const match = id.match(RE_MESSAGE_ID);
  if (!match) {
    return null;
  }

  return match[0];
}

function getMessageID(s: string): string | null {
  return getMessageIDFromURL(s) || getMessageIDPlain(s);
}

enum PruneOption {
  BeforeMessageID = "before_message_id",
  AfterMessageID = "after_message_id",
  User = "user",
  MaxDeleteCount = "max_delete_count",
  Attachments = "attachments",
  SkipPinned = "skip_pinned",
  BotsOrUsers = "bots_or_users",
}

enum PruneAttachmentsOption {
  WithAttachments = "with_attachments",
  WithoutAttachments = "without_attachments",
}

enum PruneBotsOrUsersOption {
  BotsOnly = "bots_only",
  UsersOnly = "users_only",
}

export default class PruneCommand extends SlashCommandHandler {
  serverOnly = true;

  requiredBotPermissions = PermissionFlagsBits.ManageMessages.toString();

  command = new SlashCommandBuilder()
    .setName("prune")
    .setDescription("Bulk delete messages with optional filters.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    .addStringOption((o) =>
      o
        .setName(PruneOption.AfterMessageID)
        .setDescription(
          "Delete messages **after** this message ID or message link. (exclusive)"
        )
        .setRequired(false)
    )
    .addStringOption((o) =>
      o
        .setName(PruneOption.BeforeMessageID)
        .setDescription(
          "Delete messages **before** this message ID or message link. (exclusive)"
        )
        .setRequired(false)
    )
    .addUserOption((o) =>
      o
        .setName(PruneOption.User)
        .setDescription("Delete messages from only this user.")
        .setRequired(false)
    )
    .addIntegerOption((o) =>
      o
        .setName(PruneOption.MaxDeleteCount)
        .setDescription("Max messages to delete. (2-100)")
        .setMinValue(2)
        .setMaxValue(100)
        .setRequired(false)
    )
    .addBooleanOption((o) =>
      o
        .setName(PruneOption.SkipPinned)
        .setDescription("Don't delete pinned messages.")
        .setRequired(false)
    )
    .addStringOption((o) =>
      o
        .setName(PruneOption.BotsOrUsers)
        .setDescription("Filter by messages by bots or users.")
        .setChoices(
          {
            name: "Only delete messages by users",
            value: PruneBotsOrUsersOption.UsersOnly,
          },
          {
            name: "Only delete messages by bots",
            value: PruneBotsOrUsersOption.BotsOnly,
          }
        )
        .setRequired(false)
    )
    .addStringOption((o) =>
      o
        .setName(PruneOption.Attachments)
        .setDescription("Filter by messages with or without attachments.")
        .setChoices(
          {
            name: "Only messages with attachments",
            value: PruneAttachmentsOption.WithAttachments,
          },
          {
            name: "Only messages without attachments",
            value: PruneAttachmentsOption.WithoutAttachments,
          }
        )
        .setRequired(false)
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

    const afterMessageIDStr = options.getString(PruneOption.AfterMessageID);
    const beforeMessageIDStr = options.getString(PruneOption.BeforeMessageID);
    const user = options.getUser(PruneOption.User);
    const maxDeleteCount = options.getInteger(PruneOption.MaxDeleteCount);
    const skipPinned = options.getBoolean(PruneOption.SkipPinned);
    const attachments = options.getString(PruneOption.Attachments);
    const botsOrUsers = options.getString(PruneOption.BotsOrUsers);

    const afterMessageID = afterMessageIDStr
      ? getMessageID(afterMessageIDStr)
      : null;

    const beforeMessageID = beforeMessageIDStr
      ? getMessageID(beforeMessageIDStr)
      : null;

    // After is oldest, smallest number
    // Before is newest, largest number
    if (afterMessageID && beforeMessageID) {
      if (BigInt(afterMessageID) > BigInt(beforeMessageID)) {
        await interactionReplyErrorMessage(
          ctx,
          interaction,
          "After message ID must be older than before message ID.",
          true
        );

        return;
      }
    }

    const getMessagesOptions = {
      limit: 100,
      // Use after if it is provided
      after: afterMessageID || undefined,
      // If before is provided, only use it if after is not provided
      // Assumption: Most cases will not have 100 messages old, so providing
      // after instead of before will return < 100 messages.
      before:
        afterMessageID === null && beforeMessageID
          ? beforeMessageID
          : undefined,
    };

    const msgs = await ctx.REST.getChannelMessages(
      interaction.channel_id,
      getMessagesOptions
    );

    if (msgs.err) {
      await interactionReplyErrorMessage(
        ctx,
        interaction,
        `Failed to fetch messages: ${msgs.val.message}`,
        true
      );

      return;
    }

    const msgsData = msgs.safeUnwrap();

    const filteredMsgs = msgsData.filter((msg) => {
      if (skipPinned && msg.pinned) {
        return false;
      }

      if (user && msg.author.id !== user.id) {
        return false;
      }

      // Skip no attachments
      if (
        attachments === PruneAttachmentsOption.WithAttachments &&
        msg.attachments.length === 0
      ) {
        return false;
      }

      // Skip with attachments
      if (
        attachments === PruneAttachmentsOption.WithoutAttachments &&
        msg.attachments.length > 0
      ) {
        return false;
      }

      // Bots only, but user is not a bot, skip
      if (botsOrUsers === PruneBotsOrUsersOption.BotsOnly && !msg.author.bot) {
        return false;
      }

      // Users only, but user is a bot, skip
      if (botsOrUsers === PruneBotsOrUsersOption.UsersOnly && msg.author.bot) {
        return false;
      }

      const msgIDBigInt = BigInt(msg.id);
      // All message IDs must be smaller than before message ID
      if (beforeMessageID && msgIDBigInt >= BigInt(beforeMessageID)) {
        return false;
      }

      // All message IDs must be larger than after message ID
      if (afterMessageID && msgIDBigInt <= BigInt(afterMessageID)) {
        return false;
      }

      return true;
    });

    const trimmedMsgIDs = filteredMsgs.slice(0, maxDeleteCount || 100);

    const userDeletedSummary = trimmedMsgIDs.reduce((acc, msg) => {
      if (acc[msg.author.id]) {
        acc[msg.author.id] += 1;
      } else {
        acc[msg.author.id] = 1;
      }

      return acc;
    }, {} as Record<string, number>);

    const res = await ctx.REST.bulkDeleteChannelMessages(
      interaction.channel_id,
      trimmedMsgIDs.map((m) => m.id)
    );

    if (res.err) {
      await interactionReplyErrorMessage(
        ctx,
        interaction,
        `Failed to delete messages: ${res.val.message}`,
        true
      );

      return;
    }

    const fields = [];

    let rangeStr = "";
    if (afterMessageID && beforeMessageID) {
      rangeStr = `${afterMessageID} to ${beforeMessageID}`;
    }

    if (afterMessageID && !beforeMessageID) {
      rangeStr = `After ${afterMessageID}`;
    }

    if (!afterMessageID && beforeMessageID) {
      rangeStr = `Before ${beforeMessageID}`;
    }

    if (rangeStr) {
      fields.push({
        name: "Range",
        value: rangeStr,
      });
    }

    if (Object.keys(userDeletedSummary).length > 0) {
      fields.push({
        name: "Deleted messages sent by",
        value: Object.entries(userDeletedSummary)
          .map(([userID, count]) => `<@${userID}> - ${count}`)
          .join("\n"),
      });
    }

    await ctx.REST.interactionReply(interaction, {
      embeds: [
        new EmbedBuilder()
          .setTitle(`Deleted ${trimmedMsgIDs.length} messages`)
          .addFields(fields)
          .setColor(Color.Success)
          .toJSON(),
      ],
      flags: MessageFlags.Ephemeral,
    });
  }
}
