import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import customIds from "../customIds";

export function getGiveawayComponents(
  numEntries: number,
  isEnded: boolean,
): ActionRowBuilder<ButtonBuilder>[] {
  // Static custom Id
  const customId = customIds.giveawayEnterButton.compile();
  const row = new ActionRowBuilder<ButtonBuilder>();

  const entryButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Primary)
    .setEmoji("🎉")
    .setLabel("Enter Giveaway")
    .setCustomId(customId);

  if (isEnded) {
    entryButton.setDisabled(true).setLabel("Giveaway Ended");
  }

  row.addComponents(entryButton);

  const entryCountDisplay = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setLabel(`${numEntries} entries`)
    .setEmoji("🎟️")
    .setCustomId("dummy")
    .setDisabled(true);

  row.addComponents(entryCountDisplay);

  return [row];
}

export function getRemoveEntryComponents(): ActionRowBuilder<ButtonBuilder>[] {
  const entryButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Danger)
    .setEmoji("🗑️")
    .setLabel("Remove Entry")
    .setCustomId("meow");

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(entryButton);

  return [row];
}
