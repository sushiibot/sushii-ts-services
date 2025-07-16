import { MessageFlags } from "discord.js";
import {
  ActionRow,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonComponent,
  ButtonInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js";
import Context from "../../../model/context";
import customIds from "../../customIds";
import { ButtonHandler } from "../../handlers";
import { ActionType } from "../ActionType";
import buildUserHistoryEmbeds from "../formatters/history";
import buildUserLookupEmbed from "../formatters/lookup";
import { getUserLookupData } from "../LookupCommand";
import { getUserModLogHistory } from "../../../db/ModLog/ModLog.repository";
import db from "../../../infrastructure/database/db";

export const lookupButtonCustomIDPrefix = "lookup:button:";

export default class ContextLookUpButtonHandler extends ButtonHandler {
  customIDMatch = customIds.lookupButton.match;

  // eslint-disable-next-line class-methods-use-this
  async handleInteraction(
    ctx: Context,
    interaction: ButtonInteraction,
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Not a guild interaction");
    }

    const customIDMatch = this.customIDMatch(interaction.customId);
    if (!customIDMatch) {
      throw new Error("Invalid custom ID");
    }

    const { actionType, targetId } = customIDMatch.params;

    // There is no permission check here because the only way to trigger this
    // button is from the userinfo context menu which only displays button if
    // the user already has the required permissions.

    switch (actionType) {
      case ActionType.Ban:
      case ActionType.BanRemove:
      case ActionType.Note:
      case ActionType.Kick:
      case ActionType.Timeout:
      case ActionType.TimeoutRemove:
      case ActionType.TimeoutAdjust:
      case ActionType.Warn:
        await interaction.reply({
          content: "Oops, this hasn't been implemented yet! Coming soon...",
          flags: MessageFlags.Ephemeral,
        });

        return;

      case ActionType.History: {
        const cases = await getUserModLogHistory(db, {
          guildId: interaction.guild.id,
          userId: targetId,
        });

        const { embeds, components } = interaction.message;

        // Add history embed
        const embedBuilders = embeds.map((e) => new EmbedBuilder(e.data));
        embedBuilders.push(buildUserHistoryEmbeds(cases, "context_menu")[0]);

        // TODO: Make stateless re-generation of embeds instead of modifying
        // existing embeds that is prone to breakage

        // Update button
        const firstRow = ActionRowBuilder.from<ButtonBuilder>(
          components[0] as ActionRow<ButtonComponent>,
        );

        // Create a new builder for the history button, second row first button
        const newHistoryButton = ButtonBuilder.from(firstRow.components[0]);

        // Disable button
        newHistoryButton.setDisabled(true);
        firstRow.components[0] = newHistoryButton;

        await interaction.update({
          embeds: embedBuilders,
          components: [firstRow],
        });

        return;
      }
      case ActionType.Lookup: {
        const { embeds, components } = interaction.message;

        const embedBuilders = embeds.map((e) => new EmbedBuilder(e.data));

        const targetUser = await interaction.client.users.fetch(targetId);
        let targetMember;
        try {
          targetMember = await interaction.guild.members.fetch(targetId);
        } catch (e) {
          // Ignore
        }

        const sushiiMember = interaction.guild.members.me;
        const hasPermission = sushiiMember?.permissions.has(
          PermissionFlagsBits.BanMembers,
        );

        const bans = await getUserLookupData(ctx, targetUser);

        const embed = await buildUserLookupEmbed(
          targetUser,
          targetMember,
          bans,
          true,
          {
            botHasBanPermission: hasPermission ?? true,
            showBasicInfo: false,
          },
        );

        embedBuilders.push(embed);

        // Disable lookup button, first row now, second button
        const firstRow = ActionRowBuilder.from<ButtonBuilder>(
          components[0] as ActionRow<ButtonComponent>,
        );

        const lookupButton = ButtonBuilder.from(
          firstRow.components[1],
        ).setDisabled(true);
        firstRow.components[1] = lookupButton;

        await interaction.update({
          embeds: embedBuilders,
          components: [firstRow],
        });
      }
    }

    // TODO: Confirm button
  }
}
