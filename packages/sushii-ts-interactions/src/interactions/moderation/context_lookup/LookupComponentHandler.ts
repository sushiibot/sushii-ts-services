import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  SelectMenuBuilder,
  SelectMenuOptionBuilder,
} from "@discordjs/builders";
import dayjs from "dayjs";
import { isGuildInteraction } from "discord-api-types/utils/v10";
import {
  APIMessageComponentButtonInteraction,
  ButtonStyle,
  MessageFlags,
} from "discord-api-types/v10";
import { lookup } from "dns";
import Context from "../../../model/context";
import Color from "../../../utils/colors";
import { ButtonHandler } from "../../handlers";
import buildUserHistoryEmbed from "../formatters/history";

export const lookupButtonCustomIDPrefix = "lookup:button:";

export enum Action {
  Ban = "ban",
  Kick = "kick",
  Mute = "mute",
  Unmute = "unmute",
  Warn = "warn",
  History = "history",
  Lookup = "lookup",
}

function strToAction(s: string): Action {
  switch (s) {
    case "ban":
      return Action.Ban;
    case "kick":
      return Action.Kick;
    case "mute":
      return Action.Mute;
    case "unmute":
      return Action.Mute;
    case "warn":
      return Action.Warn;
    case "history":
      return Action.History;
    case "lookup":
      return Action.Lookup;
    default:
      throw new Error(`Invalid action ${s}`);
  }
}

interface ButtonAction {
  action: Action;
  target: string;
}

function parseCustomID(id: string): ButtonAction {
  const arr = id.split(":");
  if (arr.length !== 4) {
    throw new Error(`Invalid custom ID ${id}`);
  }

  // lookup:button:lookup:id
  return {
    action: strToAction(arr[2]),
    target: arr[3],
  };
}

export default class ContextLookUpButtonHandler extends ButtonHandler {
  customIDPrefix = lookupButtonCustomIDPrefix;

  // eslint-disable-next-line class-methods-use-this
  async handleInteraction(
    ctx: Context,
    interaction: APIMessageComponentButtonInteraction
  ): Promise<void> {
    if (!isGuildInteraction(interaction)) {
      throw new Error("Not a guild interaction");
    }

    const { action, target } = parseCustomID(interaction.data.custom_id);

    // There is no permission check here because the only way to trigger this
    // button is from the userinfo context menu which only displays button if
    // the user already has the required permissions.

    switch (action) {
      case Action.Ban:
      case Action.Kick:
      case Action.Mute:
      case Action.Unmute:
      case Action.Warn:
        await ctx.REST.interactionReply(interaction, {
          content: "Oops, this hasn't been implemented yet! Coming soon...",
          flags: MessageFlags.Ephemeral,
        });

        return;

      case Action.History: {
        const cases = await ctx.sushiiAPI.sdk.getUserModLogHistory({
          guildId: interaction.guild_id,
          userId: target,
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
      case Action.Lookup: {
        const bans = await ctx.sushiiAPI.sdk.getUserBans({
          userId: target,
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
