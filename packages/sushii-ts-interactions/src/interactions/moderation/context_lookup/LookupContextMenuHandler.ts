import {
  ActionRowBuilder,
  ButtonBuilder,
  ContextMenuCommandBuilder,
} from "@discordjs/builders";
import { isGuildInteraction } from "discord-api-types/utils/v10";
import {
  APIContextMenuInteraction,
  ApplicationCommandType,
  ButtonStyle,
  MessageFlags,
} from "discord-api-types/v10";
import Context from "../../../model/context";
import ContextMenuHandler from "../../handlers/ContextMenuHandler";
import getUserinfoEmbed from "../../user/userinfo.service";
import { lookupButtonCustomIDPrefix, Action } from "./LookupComponentHandler";

function buttonCustomID(userId: string, action: Action): string {
  return `${lookupButtonCustomIDPrefix}${action}:${userId}`;
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

    const banButton = new ButtonBuilder()
      .setCustomId(buttonCustomID(targetID, Action.Ban))
      .setLabel("Ban")
      .setStyle(ButtonStyle.Danger);

    const kickButton = new ButtonBuilder()
      .setCustomId(buttonCustomID(targetID, Action.Kick))
      .setLabel("Kick")
      .setStyle(ButtonStyle.Danger);

    const muteButton = new ButtonBuilder()
      .setCustomId(buttonCustomID(targetID, Action.Mute))
      .setLabel("Mute")
      .setStyle(ButtonStyle.Danger);

    const warnButton = new ButtonBuilder()
      .setCustomId(buttonCustomID(targetID, Action.Warn))
      .setLabel("Warn")
      .setStyle(ButtonStyle.Danger);

    const topRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      banButton,
      kickButton,
      muteButton,
      warnButton
    );

    const historyButton = new ButtonBuilder()
      .setCustomId(buttonCustomID(targetID, Action.History))
      .setLabel("History")
      .setStyle(ButtonStyle.Secondary);

    const lookupButton = new ButtonBuilder()
      .setCustomId(buttonCustomID(targetID, Action.Lookup))
      .setLabel("Lookup")
      .setStyle(ButtonStyle.Primary);

    const secondRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      historyButton,
      lookupButton
    );

    const embed = await getUserinfoEmbed(
      ctx,
      interaction,
      targetUser,
      targetMember
    );

    await ctx.REST.interactionReply(interaction, {
      embeds: [embed],
      flags: MessageFlags.Ephemeral,
      components: [topRow.toJSON(), secondRow.toJSON()],
    });
  }
}
