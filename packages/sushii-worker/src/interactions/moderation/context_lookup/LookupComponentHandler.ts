import { EmbedBuilder } from "@discordjs/builders";
import { isGuildInteraction } from "discord-api-types/utils/v10";
import {
  APIMessageComponentButtonInteraction,
  MessageFlags,
} from "discord-api-types/v10";
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
    interaction: APIMessageComponentButtonInteraction
  ): Promise<void> {
    if (!isGuildInteraction(interaction)) {
      throw new Error("Not a guild interaction");
    }

    const customIDMatch = this.customIDMatch(interaction.data.custom_id);
    if (!customIDMatch) {
      throw new Error("Invalid custom ID");
    }

    const { actionType, targetId } = customIDMatch.params;

    // There is no permission check here because the only way to trigger this
    // button is from the userinfo context menu which only displays button if
    // the user already has the required permissions.

    switch (actionType) {
      case ActionType.Ban:
      case ActionType.BanRemove: // TODO: is this possible
      case ActionType.Kick:
      case ActionType.Timeout:
      case ActionType.TimeoutRemove:
      case ActionType.TimeoutAdjust:
      case ActionType.Warn:
        await ctx.REST.interactionReply(interaction, {
          content: "Oops, this hasn't been implemented yet! Coming soon...",
          flags: MessageFlags.Ephemeral,
        });

        return;

      case ActionType.History: {
        const cases = await ctx.sushiiAPI.sdk.getUserModLogHistory({
          guildId: interaction.guild_id,
          userId: targetId,
        });

        const { embeds, components } = interaction.message;

        embeds.push(buildUserHistoryEmbed(cases, "context_menu").toJSON());

        // Disable history button, second row, first button
        const historyButton = components?.at(1)?.components.at(0);
        if (components && historyButton) {
          historyButton.disabled = true;

          components[1].components[0] = historyButton;
        }

        await ctx.REST.interactionEdit(interaction, {
          components,
          embeds,
        });

        return;
      }
      case ActionType.Lookup: {
        const bans = await ctx.sushiiAPI.sdk.getUserBans({
          userId: targetId,
        });

        const { embeds, components } = interaction.message;

        if (!bans.allGuildBans?.nodes || bans.allGuildBans.nodes.length === 0) {
          embeds.push(
            new EmbedBuilder()
              .setTitle("🔎 User Lookup")
              .setDescription("User has no bans in any shared servers.")
              .setColor(Color.Success)
              .toJSON()
          );
        } else {
          const bansStr = bans.allGuildBans.nodes.map((b) => b.guildId);

          embeds.push(
            new EmbedBuilder()
              .setTitle("🔎 User Lookup")
              .setDescription(bansStr.join("\n"))
              .setColor(Color.Success)
              .toJSON()
          );
        }

        // Disable lookup button, second row, second button
        const lookupButton = components?.at(1)?.components.at(1);
        if (components && lookupButton) {
          lookupButton.disabled = true;

          components[1].components[1] = lookupButton;
        }

        await ctx.REST.interactionEdit(interaction, {
          components,
          embeds,
        });

        return;
      }
    }

    // TODO: Confirm button

    ctx.REST.interactionEdit(interaction, {
      components: [],
    });
  }
}
