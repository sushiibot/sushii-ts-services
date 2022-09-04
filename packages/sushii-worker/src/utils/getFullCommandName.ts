import {
  APIChatInputApplicationCommandInteraction,
  ApplicationCommandOptionType,
} from "discord-api-types/v10";

export default function getFullCommandName(
  interaction: APIChatInputApplicationCommandInteraction
): string {
  if (!interaction.data.options || interaction.data.options.length === 0) {
    return interaction.data.name;
  }

  let { name } = interaction.data;
  let { options } = interaction.data;

  // Add subcommand group
  if (
    interaction.data.options[0].type ===
    ApplicationCommandOptionType.SubcommandGroup
  ) {
    name += ` ${options[0].name}`;
    options = interaction.data.options[0].options;
  }

  // Add subcommand
  if (
    interaction.data.options[0].type === ApplicationCommandOptionType.Subcommand
  ) {
    name += ` ${options[0].name}`;
  }

  return name;
}
