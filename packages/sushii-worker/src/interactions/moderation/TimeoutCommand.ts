import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  PermissionsBitField,
  InteractionContextType,
} from "discord.js";
import Context from "../../model/context";
import { SlashCommandHandler } from "../handlers";
import { getErrorMessage } from "../responses/error";
import { ActionType } from "./ActionType";
import executeAction from "./executeAction";
import ModActionData from "./ModActionData";
import {
  ModerationOption,
  reasonOption,
  sendDMReasonOption,
  usersOption,
} from "./options";

export default class TimeoutCommand extends SlashCommandHandler {
  serverOnly = true;

  requiredBotPermissions = new PermissionsBitField().add("ModerateMembers");

  command = new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout members.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setContexts(InteractionContextType.Guild)
    .addStringOption(usersOption(ActionType.Timeout))
    .addStringOption((o) =>
      o
        .setName(ModerationOption.Duration)
        .setDescription("How long to timeout the user.")
        .setRequired(true),
    )
    .addStringOption(reasonOption(ActionType.Timeout))
    // .addAttachmentOption(attachmentOption)
    .addStringOption(sendDMReasonOption)
    .toJSON();

  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Not in cached guild");
    }

    const data = new ModActionData(interaction, ActionType.Timeout);
    const validateRes = data.validate();
    if (validateRes.err) {
      await interaction.reply(getErrorMessage("Error", validateRes.val));

      return;
    }

    await interaction.deferReply();

    const fetchTargetsRes = await data.fetchTargets(ctx, interaction);
    if (fetchTargetsRes.err) {
      const { flags, ...editMsg } = getErrorMessage(
        "Error",
        fetchTargetsRes.val,
      );
      await interaction.editReply(editMsg);

      return;
    }

    const res = await executeAction(ctx, interaction, data, ActionType.Timeout);
    if (res.err) {
      const { flags, ...editMsg } = getErrorMessage("Error", res.val.message);
      await interaction.editReply(editMsg);

      return;
    }

    await interaction.editReply({
      embeds: [res.val],
    });
  }
}
