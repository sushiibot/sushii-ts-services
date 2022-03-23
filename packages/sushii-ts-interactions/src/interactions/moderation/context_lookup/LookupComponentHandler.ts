import {
  ActionRow,
  ButtonComponent,
  SelectMenuComponent,
  SelectMenuOption,
} from "@discordjs/builders";
import { isGuildInteraction } from "discord-api-types/utils/v9";
import {
  APIMessageComponentButtonInteraction,
  ButtonStyle,
} from "discord-api-types/v9";
import Context from "../../../context";
import { ButtonHandler } from "../../handlers";

export const lookupButtonCustomIDPrefix = "lookup:button:";

export enum Action {
  Ban = "ban",
  Kick = "kick",
  Mute = "Mute",
  Warn = "warn",
  History = "history",
  Lookup = "Lookup",
}

function strToAction(s: string): Action {
  switch (s) {
    case "ban":
      return Action.Ban;
    case "kick":
      return Action.Kick;
    case "mute":
      return Action.Mute;
    case "warn":
      return Action.Warn;
    case "history":
      return Action.History;
    case "lookup":
      return Action.Lookup;
    default:
      throw new Error("Invalid action");
  }
}

interface ButtonAction {
  action: Action;
  target: string;
}

function parseCustomID(id: string): ButtonAction {
  const arr = id.split(":");
  if (arr.length !== 3) {
    throw new Error("Invalid custom ID");
  }

  return {
    action: strToAction(arr[1]),
    target: arr[2],
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
      case Action.Warn:
        break;
      case Action.History:
        break;
      case Action.Lookup:
        break;
    }

    // TODO: Fetch rules, if empty just add confirm button

    const reasonSelect = new SelectMenuComponent()
      .setCustomId(`lookup:select:ban:${target}`)
      .setOptions([
        new SelectMenuOption()
          .setLabel("Rule 1")
          .setValue("rule1")
          .setDescription("Rule to member"),
      ])
      .setPlaceholder("Reason");

    const reasonRow = new ActionRow().addComponents(reasonSelect);

    const confirmButton = new ButtonComponent()
      .setCustomId(`lookup:button:ban:${target}`)
      .setLabel("Confirm without reason")
      .setStyle(ButtonStyle.Danger);

    const buttonRow = new ActionRow().addComponents(confirmButton);

    ctx.REST.interactionEdit(interaction, {
      components: [reasonRow, buttonRow],
    });
  }
}
