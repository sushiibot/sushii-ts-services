import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  SlashCommandBuilder,
  ButtonInteraction,
  ChatInputCommandInteraction,
  ButtonStyle,
  PermissionFlagsBits,
  DiscordAPIError,
  InteractionContextType,
} from "discord.js";
import dayjs from "dayjs";
import Context from "../../../model/context";
import Color from "../../../utils/colors";
import { SlashCommandHandler } from "../../handlers";
import { interactionReplyErrorPlainMessage } from "../../responses/error";
import { caseSpecCount, getCaseRange, parseCaseId } from "./caseId";
import { invalidCaseRangeEmbed } from "./Messages";
import { ActionType } from "../ActionType";
import customIds from "../../customIds";
import sleep from "../../../utils/sleep";
import logger from "../../../core/logger";
import db from "../../../infrastructure/database/db";
import { getGuildConfig } from "../../../db/GuildConfig/GuildConfig.repository";
import {
  getModLogsRange,
  updateModLogReasonRange,
} from "../../../db/ModLog/ModLog.repository";

enum ReasonError {
  UserFetch,
  MsgIdMissing,
  MsgLogFetch,
}

function getReasonConfirmComponents(
  userId: string,
  interactionId: string,
  hidePartialUpdateButton: boolean,
): ActionRowBuilder<ButtonBuilder> {
  const buttons = [
    new ButtonBuilder()
      .setStyle(ButtonStyle.Danger)
      .setLabel("Overwrite all")
      .setCustomId(
        customIds.reasonConfirmButton.compile({
          userId,
          // Tie the buttons to this specific interaction
          buttonId: interactionId,
          action: "override",
        }),
      ),
  ];

  if (!hidePartialUpdateButton) {
    const emptyButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setLabel("Set reasons for cases without reason")
      .setCustomId(
        customIds.reasonConfirmButton.compile({
          userId,
          buttonId: interactionId,
          action: "empty",
        }),
      );

    buttons.push(emptyButton);
  }

  const cancelButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel("Cancel")
    .setCustomId(
      customIds.reasonConfirmButton.compile({
        userId,
        buttonId: interactionId,
        action: "cancel",
      }),
    );
  buttons.push(cancelButton);

  return new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons);
}

export async function updateModLogReasons(
  ctx: Context,
  interaction:
    | ChatInputCommandInteraction<"cached">
    | ButtonInteraction<"cached">,
  guildId: string,
  modLogChannelId: string,
  executorId: string,
  [caseStartId, caseEndId]: [number, number],
  reason: string,
  onlyEmptyReason: boolean,
): Promise<EmbedBuilder | undefined> {
  if (!interaction.channel) {
    throw new Error("Channel not found");
  }

  // -------------------------------------------------------------------------
  // Update mod log in DB

  const updatedModLogs = await updateModLogReasonRange(
    db,
    guildId,
    executorId,
    caseStartId.toString(),
    caseEndId.toString(),
    reason,
    onlyEmptyReason,
  );

  if (updatedModLogs.length === 0) {
    return;
  }

  // -------------------------------------------------------------------------
  // Create interaction reply embed

  const rangeStr =
    caseStartId === caseEndId
      ? `#${caseStartId}`
      : `#${caseStartId} - #${caseEndId}`;

  // error type -> caseIds
  const errs = new Map<ReasonError, string[]>();

  const uniqueAffectedUserIDs = [
    ...new Set<string>(updatedModLogs.map((m) => m.user_id)),
  ];
  const uniqueAffectedUserMentionStr = uniqueAffectedUserIDs
    .map((id) => `<@${id}>`)
    .join(", ");
  const unisueAffectedUserIDsStr = uniqueAffectedUserIDs.join("\n");

  let affectedUsersStr = uniqueAffectedUserMentionStr;
  affectedUsersStr += "\n";
  affectedUsersStr += "User IDs:\n";
  affectedUsersStr += unisueAffectedUserIDsStr;

  const responseEmbed = new EmbedBuilder()
    .setTitle(`Reason updated for case ${rangeStr}`)
    .addFields([
      {
        name: "Reason",
        value: reason,
      },
      {
        name: "Affected user histories",
        value: affectedUsersStr,
      },
    ])
    .setColor(Color.Success);

  const modLogchannel = await interaction.guild.channels.fetch(modLogChannelId);
  if (!modLogchannel || !modLogchannel.isTextBased()) {
    throw new Error("Mod log channel not found or is not text channel");
  }

  for (const modCase of updatedModLogs) {
    // -------------------------------------------------------------------------
    // Fetch the target user

    try {
      // eslint-disable-next-line no-await-in-loop
      await interaction.client.users.fetch(modCase.user_id);
    } catch (err) {
      if (err instanceof DiscordAPIError) {
        const arr = errs.get(ReasonError.UserFetch) || [];
        errs.set(ReasonError.UserFetch, [...arr, modCase.case_id]);

        continue;
      }

      throw err;
    }

    if (!modCase.msg_id) {
      const arr = errs.get(ReasonError.MsgIdMissing) || [];
      errs.set(ReasonError.MsgIdMissing, [...arr, modCase.case_id]);

      continue;
    }

    // -------------------------------------------------------------------------
    // Edit the mod log message

    // Fetch the message so we can selectively edit the embed
    let modLogMsg;
    try {
      // eslint-disable-next-line no-await-in-loop
      modLogMsg = await modLogchannel.messages.fetch(modCase.msg_id);
    } catch (err) {
      const arr = errs.get(ReasonError.MsgLogFetch) || [];
      errs.set(ReasonError.MsgLogFetch, [...arr, modCase.case_id]);

      continue;
    }

    const oldFields = modLogMsg.embeds[0].fields || [];
    const indexOfReasonField = oldFields.findIndex((f) => f.name === "Reason");

    const newEmbed = new EmbedBuilder(modLogMsg.embeds[0].data)
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      })
      // Replaces 1 element at index `indexOfReasonField`
      .spliceFields(indexOfReasonField, 1, {
        name: "Reason",
        value: reason,
        inline: false,
      });

    // Edit the original message to show the updated reason
    // eslint-disable-next-line no-await-in-loop
    await modLogMsg.edit({
      embeds: [newEmbed.toJSON()],
      // Clear reason button
      components: [],
    });
  }

  const errStrs = Array.from(errs.entries()).map(([reasonErr, caseIds]) => {
    const caseStr = caseIds.join(", ");

    switch (reasonErr) {
      case ReasonError.UserFetch:
        return `Could not fetch user for cases: ${caseStr}`;
      case ReasonError.MsgIdMissing:
        return `Mod log message missing for cases: ${caseStr}`;
      case ReasonError.MsgLogFetch:
        return `Could not fetch mod log message for cases: ${caseStr}`;
      default:
        return `Unknown error for case: ${caseStr}`;
    }
  });

  if (errStrs.length > 0) {
    let errMessage = `I updated the reason in the users' histories, but some \
cases may not have been updated in the mod log channel. This could be due \
to the mod log channel being changed, or I don't have permission to view \
the mod log channel (<#${modLogChannelId}>).`;
    errMessage += "\n\n";
    errMessage += `${errStrs.join("\n")}`;

    responseEmbed.addFields({
      name: "Note",
      value: errMessage,
    });
  }

  return responseEmbed;
}

export default class ReasonCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("reason")
    .setDescription("Set the reason for mod cases.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setContexts(InteractionContextType.Guild)
    .addStringOption((o) =>
      o
        .setName("case")
        .setDescription("Case numbers you want to set the reason for.")
        .setAutocomplete(true)
        .setRequired(true),
    )
    .addStringOption((o) =>
      o
        .setName("reason")
        .setDescription("Reason for the mod case.")
        .setRequired(true),
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const caseRangeStr = interaction.options.getString("case", true);
    const reason = interaction.options.getString("reason", true);

    const config = await getGuildConfig(db, interaction.guildId);

    // No guild config found, ignore
    if (
      !config || // Config not found
      !config.log_mod || // No mod log set
      !config.log_mod_enabled // Mod log disabled
    ) {
      return;
    }

    const caseSpec = parseCaseId(caseRangeStr);
    if (!caseSpec) {
      await interaction.reply({
        embeds: [invalidCaseRangeEmbed],
      });

      return;
    }

    const affectedCaseCount = caseSpecCount(caseSpec);
    if (affectedCaseCount && affectedCaseCount > 25) {
      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        `You can only modify up to 25 cases at a time (${affectedCaseCount} > 25)`,
      );

      return;
    }

    const caseRange = await getCaseRange(ctx, interaction.guildId, caseSpec);
    if (!caseRange) {
      await interaction.reply({
        embeds: [invalidCaseRangeEmbed],
      });

      return;
    }

    const [caseStartId, caseEndId] = caseRange;

    // -------------------------------------------------------------------------
    // Check & confirm/cancel override

    // Get all mod logs in range
    const cases = await getModLogsRange(
      db,
      interaction.guildId,
      caseStartId.toString(),
      caseEndId.toString(),
    );

    // Check if any of the mod logs already have reasons set
    const casesWithReason =
      cases
        .filter((c) => c.reason !== null)
        .map((c) => {
          const actionType = ActionType.fromString(c.action);

          let s = `\`#${c.case_id}\` - **${ActionType.toString(actionType)}**`;
          s += ` - <@${c.user_id}>\n`;
          s += `┗ **Reason:** ${c.reason}`;

          return s;
        }) || [];

    // If so, send confirmation message with buttons
    // - Override
    // - Only update empty reasons
    // - Cancel
    //
    // Buttons should only be clickable by the user who ran the command
    // custom_id: reason_confirm/user_id/uuid
    if (casesWithReason.length > 0) {
      let description = `**${casesWithReason.length} / ${cases.length}** of specified cases already have reasons set:\n\n`;
      description += `${casesWithReason.join("\n")}`;
      description += "\n\nPick an option below to continue or cancel.";

      const embed = new EmbedBuilder()
        .setTitle("Warning")
        .setDescription(description)
        .setFields({
          name: "New Reason",
          value: reason,
        })
        .setFooter({
          text: "Cancels in 2 minutes",
        })
        .setColor(Color.Warning);

      const components = getReasonConfirmComponents(
        interaction.member.user.id,
        interaction.id,
        // All cases have reasons set, so it's either override all or cancel.
        // No option to set for empty reasons only
        casesWithReason.length === cases.length,
      );

      await interaction.reply({
        embeds: [embed.toJSON()],
        components: [components.toJSON()],
      });

      ctx.memoryStore.pendingReasonConfirmations.set(interaction.id, {
        caseEndId,
        caseStartId,
        reason,
        setAt: dayjs.utc(),
      });

      // Wait 2 minutes
      await sleep(2 * 60 * 1000);

      // Check if the confirmation in store still exists - not clicked yet
      const pendingConf = ctx.memoryStore.pendingReasonConfirmations.get(
        interaction.id,
      );

      // Still pending, update message and delete
      if (pendingConf) {
        logger.debug(
          {
            interactionId: interaction.id,
          },
          "Confirmation message is still pending, deleting",
        );

        ctx.memoryStore.pendingReasonConfirmations.delete(interaction.id);

        const expiredEmbed = new EmbedBuilder()
          .setTitle("Confirmation Expired")
          .setDescription(
            "Reason confirmation expired. Run the `/reason` command again if you still want to update the cases.",
          )
          .setColor(Color.Error);

        await interaction.editReply({
          embeds: [expiredEmbed.toJSON()],
          components: [],
        });
      }

      return;
    }

    // Ack AFTER confirmation message, takes long to edit messages, but db queries are quick
    await interaction.deferReply();

    const responseEmbed = await updateModLogReasons(
      ctx,
      interaction,
      interaction.guildId,
      config.log_mod,
      interaction.member.user.id,
      caseRange,
      reason,
      // update all cases, not just empty reasons
      false,
    );

    if (!responseEmbed) {
      const embed = new EmbedBuilder()
        .setTitle("No cases updated")
        .setDescription("Hmm.. there weren't any cases to update.")
        .setColor(Color.Error);

      await interaction.editReply({
        embeds: [embed.toJSON()],
      });

      return;
    }

    await interaction.editReply({
      embeds: [responseEmbed.toJSON()],
    });
  }
}
