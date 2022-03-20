import { isMessageComponentSelectMenuInteraction } from "discord-api-types/utils/v9";
import { APIMessageComponentInteraction } from "discord-api-types/v9";
import Context from "../../../context";
import MessageComponentHandler from "../../handlers/MessageComponentHandler";

export default class ContextButtonHandler extends MessageComponentHandler {
  buttonId = "should be dynamic hmm";

  customIDPrefix = "lookup";

  // eslint-disable-next-line class-methods-use-this
  async handleInteraction(
    _ctx: Context,
    interaction: APIMessageComponentInteraction
  ): Promise<void> {
    if (isMessageComponentSelectMenuInteraction(interaction)) {
      if (interaction.data.values.length !== 1) {
        throw new Error("Expected exactly one value");
      }
    }
  }
}
