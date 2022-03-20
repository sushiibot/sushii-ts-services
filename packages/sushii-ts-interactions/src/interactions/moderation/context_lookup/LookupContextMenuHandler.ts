import {
  ActionRow,
  ButtonComponent,
  ContextMenuCommandBuilder,
  SelectMenuComponent,
  SelectMenuOption,
} from "@discordjs/builders";
import { isGuildInteraction } from "discord-api-types/utils/v9";
import {
  APIContextMenuInteraction,
  ApplicationCommandType,
  ButtonStyle,
  MessageFlags,
} from "discord-api-types/v9";
import Context from "../../../context";
import ContextMenuHandler from "../../handlers/ContextMenuHandler";
import getUserinfoEmbed from "../../user/userinfo.service";

function banButtonId(userId: string): string {
  return `userinfo:ban:${userId}`;
}

export default class UserInfoHandler extends ContextMenuHandler {
  serverOnly = true;

  command = new ContextMenuCommandBuilder()
    .setName("User Info")
    .setType(ApplicationCommandType.User)
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: APIContextMenuInteraction
  ): Promise<void> {
    if (!isGuildInteraction(interaction)) {
      throw new Error("Not a guild interaction");
    }

    if ("messages" in interaction.data.resolved) {
      throw new Error(
        "Message should not be resolved: not a user application command"
      );
    }

    const targetID = interaction.data.target_id;
    const targetUser = interaction.data.resolved.users[targetID];
    const targetMember = interaction.data.resolved.members?.[targetID];

    const button = new ButtonComponent()
      .setCustomId(banButtonId(targetID))
      .setLabel("Ban")
      .setStyle(ButtonStyle.Danger);
    const row = new ActionRow().addComponents(button);

    const reasonSelect = new SelectMenuComponent()
      .setCustomId("userinfo:ban:reason")
      .setOptions([
        new SelectMenuOption()
          .setLabel("Rule 1")
          .setValue("rule1")
          .setDescription("Rule to member"),
      ])
      .setPlaceholder("Reason");
    const reasonRow = new ActionRow().addComponents(reasonSelect);

    const embed = await getUserinfoEmbed(
      ctx,
      interaction,
      targetUser,
      targetMember
    );

    await ctx.REST.interactionReply(interaction, {
      embeds: [embed],
      flags: MessageFlags.Ephemeral,
      components: [reasonRow, row],
    });
  }
}
