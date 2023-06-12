import { MessageFlags } from "discord-api-types/v10";
import {
  ActionRow,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonComponent,
  ButtonInteraction,
  EmbedBuilder,
} from "discord.js";
import Context from "../../../model/context";
import customIds from "../../customIds";
import { ButtonHandler } from "../../handlers";
import { ActionType } from "../ActionType";
import buildUserHistoryEmbed from "../formatters/history";
import buildUserLookupEmbed from "../formatters/lookup";
import { getUserLookupData } from "../LookupCommand";

export const lookupButtonCustomIDPrefix = "lookup:button:";

export default class ContextLookUpButtonHandler extends ButtonHandler {
  customIDMatch = customIds.lookupButton.match;

  // eslint-disable-next-line class-methods-use-this
  async handleInteraction(
    ctx: Context,
    interaction: ButtonInteraction
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
        const cases = await ctx.sushiiAPI.sdk.getUserModLogHistory({
          guildId: interaction.guildId,
          userId: targetId,
        });

        const { embeds, components } = interaction.message;

        // Add history embed
        const embedBuilders = embeds.map((e) => new EmbedBuilder(e.data));
        embedBuilders.push(buildUserHistoryEmbed(cases, "context_menu"));

        // Update button
        const secondRow = ActionRowBuilder.from<ButtonBuilder>(
          components[1] as ActionRow<ButtonComponent>
        );

        // Create a new builder for the history button, second row first button
        const newHistoryButton = ButtonBuilder.from(secondRow.components[0]);

        // Disable button
        newHistoryButton.setDisabled(true);
        secondRow.components[0] = newHistoryButton;

        await interaction.update({
          embeds: embedBuilders,
          components: [components[0], secondRow.toJSON()],
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

        const bans = await getUserLookupData(ctx, targetUser);

        const embed = await buildUserLookupEmbed(
          targetUser,
          targetMember,
          bans,
          true,
          false
        );

        embedBuilders.push(embed);

        // Disable lookup button, second row, second button
        const secondRow = ActionRowBuilder.from<ButtonBuilder>(
          components[1] as ActionRow<ButtonComponent>
        );

        const lookupButton = ButtonBuilder.from(
          secondRow.components[1]
        ).setDisabled(true);
        secondRow.components[1] = lookupButton;

        await interaction.update({
          embeds: embedBuilders,
          components: [components[0], secondRow.toJSON()],
        });
      }
    }

    // TODO: Confirm button
  }
}
