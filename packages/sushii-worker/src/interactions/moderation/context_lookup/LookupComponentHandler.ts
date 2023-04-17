import { MessageFlags } from "discord-api-types/v10";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  EmbedBuilder,
} from "discord.js";
import Context from "../../../model/context";
import Color from "../../../utils/colors";
import customIds from "../../customIds";
import { ButtonHandler } from "../../handlers";
import { ActionType } from "../ActionType";
import buildUserHistoryEmbed from "../formatters/history";

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
        const secondRow = new ActionRowBuilder<ButtonBuilder>({
          components: components[1].components,
        });

        // Create a new builder for the history button, second row first button
        const newHistoryButton = new ButtonBuilder(
          secondRow.components[0].data
        );

        // Disable button
        newHistoryButton.setDisabled(true);
        secondRow.components[0] = newHistoryButton;

        await interaction.editReply({
          embeds,
          components: [components[0], secondRow.toJSON()],
        });

        return;
      }
      case ActionType.Lookup: {
        const bans = await ctx.sushiiAPI.sdk.getUserBans({
          userId: targetId,
        });

        const { embeds, components } = interaction.message;

        const embedBuilders = embeds.map((e) => new EmbedBuilder(e.data));

        if (!bans.allGuildBans?.nodes || bans.allGuildBans.nodes.length === 0) {
          embedBuilders.push(
            new EmbedBuilder()
              .setTitle("🔎 User Lookup")
              .setDescription("User has no bans in any shared servers.")
              .setColor(Color.Success)
          );
        } else {
          const bansStr = bans.allGuildBans.nodes.map((b) => b.guildId);

          embedBuilders.push(
            new EmbedBuilder()
              .setTitle("🔎 User Lookup")
              .setDescription(bansStr.join("\n"))
              .setColor(Color.Success)
          );
        }

        // Disable lookup button, second row, second button
        const secondRow = new ActionRowBuilder<ButtonBuilder>({
          components: components[1].components,
        });

        const lookupButton = new ButtonBuilder(secondRow.components[1].data);
        lookupButton.setDisabled(true);
        secondRow.components[1] = lookupButton;

        await interaction.editReply({
          embeds,
          components: [components[0], secondRow.toJSON()],
        });
      }
    }

    // TODO: Confirm button
  }
}
