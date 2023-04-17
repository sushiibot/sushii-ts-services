import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { AutocompleteFocusedOption, AutocompleteInteraction } from "discord.js";
import Context from "../../model/context";
import { AutocompleteHandler } from "../handlers";

export default class RoleMenuAutocomplete extends AutocompleteHandler {
  fullCommandNamePath = [
    "rolemenu.get",
    "rolemenu.edit",
    "rolemenu.editorder",
    "rolemenu.addroles",
    "rolemenu.removeroles",
    "rolemenu.delete",
    "rolemenu.send",
    "rolemenu.roleoptions",
  ];

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: AutocompleteInteraction,
    option: AutocompleteFocusedOption
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Guild missing");
    }

    if (option.type !== ApplicationCommandOptionType.String) {
      throw new Error("Option type must be string.");
    }

    const matching = await ctx.sushiiAPI.sdk.searchRoleMenuStartingWith({
      guildId: interaction.guildId,
      menuNameStartsWith: option.value,
    });

    const choices = matching.allRoleMenus?.nodes.slice(0, 25).map((s) => ({
      name: s.menuName,
      value: s.menuName,
    }));

    await interaction.respond(choices || []);
  }
}
