import { EmbedBuilder, SlashCommandBuilder } from "@discordjs/builders";
import {
  APIChatInputApplicationCommandGuildInteraction,
  PermissionFlagsBits,
} from "discord-api-types/v10";
import SushiiEmoji from "../../../constants/SushiiEmoji";
import Context from "../../../model/context";
import Color from "../../../utils/colors";
import { SlashCommandHandler } from "../../handlers";
import CommandInteractionOptionResolver from "../../resolver";
import { interactionReplyErrorPlainMessage } from "../../responses/error";
import { caseSpecCount, parseCaseId } from "./caseId";

enum ReasonError {
  UserFetch,
  MsgIdMissing,
  MsgLogFetch,
}

export default class ReasonCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("reason")
    .setDescription("Set the reason for a mod case.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addStringOption((o) =>
      o
        .setName("case")
        .setDescription("Case number you want to set the reason for.")
        .setAutocomplete(true)
        .setRequired(true)
    )
    .addStringOption((o) =>
      o
        .setName("reason")
        .setDescription("Reason for the mod case.")
        .setRequired(true)
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

    const caseRange = options.getString("case");
    if (!caseRange) {
      throw new Error("no case number provided");
    }

    const reason = options.getString("reason");
    if (!reason) {
      throw new Error("no reason provided");
    }

    const { guildConfigById } = await ctx.sushiiAPI.sdk.guildConfigByID({
      guildId: interaction.guild_id,
    });

    // No guild config found, ignore
    if (
      !guildConfigById || // Config not found
      !guildConfigById.logMod || // No mod log set
      !guildConfigById.logModEnabled // Mod log disabled
    ) {
      return;
    }

    const caseSpec = parseCaseId(caseRange);
    if (!caseSpec) {
      await ctx.REST.interactionReply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setTitle("Invalid case range")
            .setDescription(
              `The cases you provided was invalid. Here are some examples to update cases:\n\n\
${SushiiEmoji.BlueDot}A single case: \`120\` - Updates case 120\n\
${SushiiEmoji.BlueDot}A range of cases: \`120-130\` - Updates all cases including and between 120 to 130\n\
${SushiiEmoji.BlueDot}The latest case: \`latest\` - Updates the latest case\n\
${SushiiEmoji.BlueDot}Multiple latest cases: \`latest~3\` - Updates the latest 3 cases\n\n\
Note that if you are updating multiple cases, you can only update up to 25 cases at a time.\n\
If you're only updating 1 case, it may be easier to use the button in your mod log to set reasons.`
            )
            .setColor(Color.Error)
            .toJSON(),
        ],
      });

      return;
    }

    const affectedCaseCount = caseSpecCount(caseSpec);
    if (affectedCaseCount && affectedCaseCount > 25) {
      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        `You can only modify up to 25 cases at a time (${affectedCaseCount} > 25)`
      );

      return;
    }

    // Always a range even if it's single or latest
    // Range is INCLUSIVE of both start and end
    let caseStartId;
    let caseEndId;

    // TODO: Bulk update mod log
    switch (caseSpec.type) {
      case "single": {
        const { modLogByGuildIdAndCaseId } = await ctx.sushiiAPI.sdk.getModLog({
          guildId: interaction.guild_id,
          caseId: caseSpec.id.toString(),
        });

        // Early pre-check for single case updates
        if (!modLogByGuildIdAndCaseId) {
          await interactionReplyErrorPlainMessage(
            ctx,
            interaction,
            `Case \`#${caseSpec.id}\` not found. Make sure you have the correct case number.`
          );

          return;
        }

        caseStartId = caseSpec.id;
        caseEndId = caseSpec.id;
        break;
      }
      case "range": {
        caseStartId = caseSpec.startId;
        caseEndId = caseSpec.endId;
        break;
      }
      case "latest": {
        const { nextCaseId } = await ctx.sushiiAPI.sdk.getNextCaseID({
          guildId: interaction.guild_id,
        });

        if (!nextCaseId) {
          throw new Error("nextCaseId not found");
        }

        const latestCaseId = parseInt(nextCaseId, 10) - 1;
        caseStartId = latestCaseId - caseSpec.count + 1;
        caseEndId = latestCaseId;
      }
    }

    if (!caseStartId || !caseEndId) {
      throw new Error("caseStartId or caseEndId should be defined");
    }

    // -------------------------------------------------------------------------
    // Update mod log in DB

    const ackRes = await ctx.REST.interactionReplyDeferred(interaction);
    ackRes.unwrap();

    const { bulkUpdateModLogReason } =
      await ctx.sushiiAPI.sdk.bulkUpdateModLogReason({
        guildId: interaction.guild_id,
        startCaseId: caseStartId.toString(),
        endCaseId: caseEndId.toString(),
        executorId: interaction.member.user.id,
        reason,
      });

    if (
      !bulkUpdateModLogReason?.modLogs ||
      bulkUpdateModLogReason.modLogs.length === 0
    ) {
      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        "Hmm... there weren't any cases to be updated."
      );

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

    const uniqueAffectedUsers = new Set<string>(
      bulkUpdateModLogReason.modLogs.map((m) => `<@${m.userId}>`)
    );

    const responseEmbed = new EmbedBuilder()
      .setTitle(`Reason updated for case ${rangeStr}`)
      .addFields([
        {
          name: "Reason",
          value: reason,
        },
        {
          name: "Affected user histories",
          value: [...uniqueAffectedUsers].join(", "),
        },
      ])
      .setColor(Color.Success);

    for (const modCase of bulkUpdateModLogReason.modLogs) {
      // -------------------------------------------------------------------------
      // Fetch the target user

      // eslint-disable-next-line no-await-in-loop
      const targetUser = await ctx.REST.getUser(modCase.userId);
      if (targetUser.err) {
        const arr = errs.get(ReasonError.UserFetch) || [];
        errs.set(ReasonError.UserFetch, [...arr, modCase.caseId]);

        continue;
      }

      if (!modCase.msgId) {
        const arr = errs.get(ReasonError.MsgIdMissing) || [];
        errs.set(ReasonError.MsgIdMissing, [...arr, modCase.caseId]);

        continue;
      }

      // -------------------------------------------------------------------------
      // Edit the mod log message

      // Fetch the message so we can selectively edit the embed
      // eslint-disable-next-line no-await-in-loop
      const modLogMsg = await ctx.REST.getChannelMessage(
        guildConfigById.logMod,
        modCase.msgId
      );
      if (modLogMsg.err) {
        const arr = errs.get(ReasonError.MsgLogFetch) || [];
        errs.set(ReasonError.MsgLogFetch, [...arr, modCase.caseId]);

        continue;
      }

      const oldFields = modLogMsg.val.embeds[0].fields || [];
      const indexOfReasonField = oldFields.findIndex(
        (f) => f.name === "Reason"
      );

      const newEmbed = new EmbedBuilder(modLogMsg.val.embeds[0])
        .setAuthor({
          name: `${interaction.member.user.username}#${interaction.member.user.discriminator}`,
          iconURL: ctx.CDN.userFaceURL(interaction.member.user),
        })
        // Replaces 1 element at index `indexOfReasonField`
        .spliceFields(indexOfReasonField, 1, {
          name: "Reason",
          value: reason,
          inline: false,
        });

      // Edit the original message to show the updated reason
      // eslint-disable-next-line no-await-in-loop
      await ctx.REST.editChannelMessage(guildConfigById.logMod, modCase.msgId, {
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
the mod log channel (<#${guildConfigById.logMod}>).`;
      errMessage += "\n";
      errMessage += `${errStrs.join("\n")}`;

      responseEmbed.addFields({
        name: "Note",
        value: errMessage,
      });
    }

    await ctx.REST.interactionEditOriginal(interaction, {
      embeds: [responseEmbed.toJSON()],
    });
  }
}
