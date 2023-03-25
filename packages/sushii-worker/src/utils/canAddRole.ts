import { Err, Ok, Result } from "ts-results";
import { ChatInputCommandInteraction, Role } from "discord.js";

export default async function canAddRole(
  interaction: ChatInputCommandInteraction<"cached">,
  role: Role
): Promise<Result<void, string>> {
  const sushiiMember = interaction.guild.members.me;

  if (!sushiiMember) {
    return Err("Failed to get sushii member");
  }

  // Check if role is higher than sushii's highest role
  // Level role must be below sushii's highest role

  // Negative if sushii highest role is lower than role.
  // 0 if equal
  if (sushiiMember.roles.highest.comparePositionTo(role) <= 0) {
    Err(
      "Role must be lower than sushii's highest role. Please move the role below sushii's role or move sushii's role to be higher."
    );
  }

  return Ok.EMPTY;
}
