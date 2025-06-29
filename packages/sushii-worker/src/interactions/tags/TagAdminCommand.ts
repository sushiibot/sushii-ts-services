import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommandHandler } from "../handlers";
import Context from "../../model/context";
import db from "../../infrastructure/database/config/db";
import Color from "../../utils/colors";
import { deleteOwnerTags, deleteTag } from "../../infrastructure/database/repositories/Tab.repository";

enum TagAdminSubcommand {
  Delete = "delete",
  DeleteUserTags = "delete_user_tags",
}

export default class TagAdminCommand extends SlashCommandHandler {
  command = new SlashCommandBuilder()
    .setName("tagadmin")
    .setDescription("Modify server tags.")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((c) =>
      c
        .setName(TagAdminSubcommand.Delete)
        .setDescription("Delete a tag.")
        .addStringOption((o) =>
          o
            .setName("name")
            .setDescription("The tag name to delete.")
            .setAutocomplete(true)
            .setRequired(true),
        ),
    )
    .addSubcommand((c) =>
      c
        .setName(TagAdminSubcommand.DeleteUserTags)
        .setDescription("Delete all tags created by a specific user.")
        .addUserOption((o) =>
          o
            .setName("user")
            .setDescription("The user to delete ALL tags.")
            .setRequired(true),
        ),
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Not in cached guild");
    }

    switch (interaction.options.getSubcommand()) {
      case TagAdminSubcommand.Delete:
        return this.deleteHandler(ctx, interaction);

      case TagAdminSubcommand.DeleteUserTags:
        return this.deleteUserTagsHandler(ctx, interaction);
      default:
        throw new Error("Unknown subcommand.");
    }
  }

  async deleteHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const tagName = interaction.options.getString("name", true);

    const deletedTag = await deleteTag(db, interaction.guildId, tagName);

    if (!deletedTag) {
      const embed = new EmbedBuilder()
        .setTitle("Tag Admin")
        .setDescription(`Tag \`${tagName}\` not found.`)
        .setColor(Color.Error);

      await interaction.reply({
        embeds: [embed],
      });

      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("Tag Admin")
      .setDescription(`Tag \`${tagName}\` deleted`)
      .setColor(Color.Info);

    await interaction.reply({
      embeds: [embed],
    });
  }

  async deleteUserTagsHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const user = interaction.options.getUser("user", true);

    const deleteCount = await deleteOwnerTags(db, interaction.guildId, user.id);

    const deletedNum = Number(deleteCount.numDeletedRows);

    if (deletedNum === 0) {
      const embed = new EmbedBuilder()
        .setTitle("No tags deleted")
        .setDescription(`${user} had no tags.`)
        .setColor(Color.Error);

      await interaction.reply({
        embeds: [embed],
      });

      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("Tags deleted")
      .setDescription(`${deletedNum} tags created by ${user} deleted`)
      .setColor(Color.Info);

    await interaction.reply({
      embeds: [embed],
    });
  }
}
