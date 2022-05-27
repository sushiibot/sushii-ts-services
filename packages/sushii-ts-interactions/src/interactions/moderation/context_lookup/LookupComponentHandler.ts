import {
  ActionRowBuilder,
  ButtonBuilder,
  SelectMenuBuilder,
  SelectMenuOptionBuilder,
} from "@discordjs/builders";
import { isGuildInteraction } from "discord-api-types/utils/v10";
import {
  APIMessageComponentButtonInteraction,
  ButtonStyle,
} from "discord-api-types/v10";
import Context from "../../../model/context";
import { ButtonHandler } from "../../handlers";

export const lookupButtonCustomIDPrefix = "lookup:button:";

export enum Action {
  Ban = "ban",
  Kick = "kick",
  Mute = "Mute",
  Unmute = "Unmute",
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
        break;
      case Action.Kick:
        break;
      case Action.Mute:
        break;
      case Action.Unmute:
        break;
      case Action.Warn:
        break;
      case Action.History:
        break;
      case Action.Lookup:
        break;
    }

    // TODO: Confirm button

    ctx.REST.interactionEdit(interaction, {
      components: [],
    });
  }
}
