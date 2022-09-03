import {
  APIApplicationCommandAutocompleteGuildInteraction,
  ApplicationCommandOptionType,
  InteractionResponseType,
} from "discord-api-types/v10";
import Context from "../../model/context";
import { AutocompleteHandler } from "../handlers";
import { AutocompleteOption } from "../handlers/AutocompleteHandler";

export default class RoleMenuAutocomplete extends AutocompleteHandler {
  fullCommandNamePath = [
    "rolemenu.edit",
    "rolemenu.addroles",
    "rolemenu.removeroles",
    "rolemenu.delete",
    "rolemenu.send",
    "rolemenu.roleoptions",
  ];

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: APIApplicationCommandAutocompleteGuildInteraction,
    option: AutocompleteOption
  ): Promise<void> {
    if (option.type !== ApplicationCommandOptionType.String) {
      throw new Error("Option type must be string.");
    }

    const matching = await ctx.sushiiAPI.sdk.searchRoleMenuStartingWith({
      guildId: interaction.guild_id,
      menuNameStartsWith: option.value,
    });

    const choices = matching.allRoleMenus?.nodes.slice(0, 25).map((s) => ({
      name: s.menuName,
      value: s.menuName,
    }));

    await ctx.REST.interactionCallback(interaction, {
      type: InteractionResponseType.ApplicationCommandAutocompleteResult,
      data: {
        choices,
      },
    });
  }
}
