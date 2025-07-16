import {
  ActionRowBuilder,
  ButtonBuilder,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
} from "discord.js";
import {
  ApplicationCommandType,
  ButtonStyle,
  MessageFlags,
  PermissionFlagsBits,
} from "discord.js";
import Context from "../../../model/context";
import customIds from "../../customIds";
import ContextMenuHandler from "../../handlers/ContextMenuHandler";
import getUserinfoEmbed from "../../user/userinfo.service";
import { ActionType } from "../ActionType";

export default class UserInfoHandler extends ContextMenuHandler {
  serverOnly = true;

  command = new ContextMenuCommandBuilder()
    .setName("User Info")
    .setType(ApplicationCommandType.User)
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: ContextMenuCommandInteraction,
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Not a guild interaction");
    }

    if (!interaction.isUserContextMenuCommand()) {
      throw new Error("Not a user context menu command");
    }

    const { targetUser, targetMember } = interaction;

    const isModerator = interaction.memberPermissions.has(
      PermissionFlagsBits.BanMembers,
    );

    const embed = await getUserinfoEmbed(targetUser, targetMember || undefined);

    if (!isModerator) {
      await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    /* TODO: Either remove or implement mod actions in context
    const isMuted = targetMember?.isCommunicationDisabled() ?? false;

    const banButton = new ButtonBuilder()
      .setCustomId(
        customIds.lookupButton.compile({
          actionType: ActionType.Ban,
          targetId: targetUser.id,
        }),
      )
      .setLabel("Ban")
      .setEmoji({
        name: "🔨",
      })
      .setStyle(ButtonStyle.Danger);

    const kickButton = new ButtonBuilder()
      .setCustomId(
        customIds.lookupButton.compile({
          actionType: ActionType.Kick,
          targetId: targetUser.id,
        }),
      )
      .setLabel("Kick")
      .setEmoji({
        name: "👢",
      })
      .setStyle(ButtonStyle.Secondary);

    // Mute or unmute depending on timeout state
    const muteButton = isMuted
      ? new ButtonBuilder()
          .setCustomId(
            customIds.lookupButton.compile({
              actionType: ActionType.TimeoutRemove,
              targetId: targetUser.id,
            }),
          )
          .setLabel("Unmute")
          .setEmoji({
            name: "🔉",
          })
          .setStyle(ButtonStyle.Secondary)
      : new ButtonBuilder()
          .setCustomId(
            customIds.lookupButton.compile({
              actionType: ActionType.Timeout,
              targetId: targetUser.id,
            }),
          )
          .setLabel("Mute")
          .setEmoji({
            name: "🔇",
          })
          .setStyle(ButtonStyle.Secondary);

    const warnButton = new ButtonBuilder()
      .setCustomId(
        customIds.lookupButton.compile({
          actionType: ActionType.Warn,
          targetId: targetUser.id,
        }),
      )
      .setLabel("Warn")
      .setEmoji({
        name: "⚠",
      })
      .setStyle(ButtonStyle.Secondary);

    const topRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
      banButton,
      kickButton,
      muteButton,
      warnButton,
    ]);
    */

    const historyButton = new ButtonBuilder()
      .setCustomId(
        customIds.lookupButton.compile({
          actionType: ActionType.History,
          targetId: targetUser.id,
        }),
      )
      .setLabel("History")
      .setStyle(ButtonStyle.Secondary);

    const lookupButton = new ButtonBuilder()
      .setCustomId(
        customIds.lookupButton.compile({
          actionType: ActionType.Lookup,
          targetId: targetUser.id,
        }),
      )
      .setLabel("Lookup")
      .setStyle(ButtonStyle.Secondary);

    const secondRow = new ActionRowBuilder<ButtonBuilder>().addComponents([
      historyButton,
      lookupButton,
    ]);

    await interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral,
      components: [secondRow],
    });
  }
}
