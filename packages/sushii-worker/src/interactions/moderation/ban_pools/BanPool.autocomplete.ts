import {
  APIApplicationCommandOptionChoice,
  ApplicationCommandOptionType,
} from "discord.js";
import { AutocompleteFocusedOption, AutocompleteInteraction } from "discord.js";
import dayjs from "@/shared/domain/dayjs";
import { AutocompleteHandler } from "../../handlers";
import { BanPoolOption, BanPoolOptionCommand } from "./BanPool.command";
import { searchGuildBanPools } from "./BanPool.repository";
import { searchBanPoolMemberships } from "./BanPoolMember.repository";
import { getAllBanPoolInvites } from "./BanPoolInvite.repository";
import toTimestamp from "../../../utils/toTimestamp";
import db from "../../../infrastructure/database/db";

export default class BanPoolAutocomplete extends AutocompleteHandler {
  fullCommandNamePath = [
    BanPoolOptionCommand.Show,
    BanPoolOptionCommand.Delete,
    BanPoolOptionCommand.Invite,
    BanPoolOptionCommand.DeleteInvite,
    BanPoolOptionCommand.ClearInvites,
  ].map((subcommand) => `banpool.${subcommand}`);

  async handleAutocomplete(
    interaction: AutocompleteInteraction,
    option: AutocompleteFocusedOption,
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Must be in guild.");
    }

    if (option.type !== ApplicationCommandOptionType.String) {
      throw new Error("Option type must be a string.");
    }

    const subcommand = interaction.options.getSubcommand();

    switch (option.name) {
      case BanPoolOption.PoolName: {
        // Should also show membership pools, not just owned pools
        if (subcommand === BanPoolOptionCommand.Show) {
          const poolOwnerships = await searchGuildBanPools(
            db,
            interaction.guildId,
            option.value,
          );

          const poolMemberships = await searchBanPoolMemberships(
            db,
            interaction.guildId,
            option.value,
          );

          const choices = [];

          // Add owned pools
          for (const pool of poolOwnerships) {
            choices.push({
              name: `${pool.pool_name} - Owned`,
              value: pool.id.toString(),
            });
          }

          // Add memberships
          for (const pool of poolMemberships) {
            const ownerGuild = interaction.client.guilds.cache.get(
              pool.owner_guild_id,
            );

            choices.push({
              name: `${pool.pool_name} - ${
                ownerGuild?.name || "Unknown owner server"
              }`,
              value: pool.id.toString(),
            });
          }

          // Sort
          choices.sort((a, b) => a.name.localeCompare(b.name));

          await interaction.respond(choices);
          return;
        }

        // Don't show any memberships -- only owned pools
        const banPools = await searchGuildBanPools(
          db,
          interaction.guildId,
          option.value,
        );

        const choices = banPools.map(
          (pool): APIApplicationCommandOptionChoice => ({
            name: pool.pool_name,
            value: pool.pool_name,
          }),
        );

        await interaction.respond(choices);
        break;
      }

      case BanPoolOption.InviteCode: {
        // Respond with ALL guild invites
        const poolName = interaction.options.getString(BanPoolOption.PoolName);
        if (!poolName) {
          // No pool name yet
          await interaction.respond([
            {
              name: "Enter the pool name first to see auto-completed invite codes",
              value: "empty",
            },
          ]);
          return;
        }

        const invites = await getAllBanPoolInvites(
          db,
          poolName,
          interaction.guildId,
        );

        const choices = invites.map(
          (invite): APIApplicationCommandOptionChoice => {
            const expiresAt = invite.expires_at
              ? dayjs.utc(invite.expires_at)
              : null;

            let expiresStr;
            if (expiresAt) {
              expiresStr = `Expires ${toTimestamp(expiresAt)}`;
            } else {
              expiresStr = "Never expires";
            }

            return {
              name: `${invite.invite_code} - ${expiresStr}`,
              value: invite.invite_code,
            };
          },
        );

        await interaction.respond(choices);
        break;
      }
    }
  }
}
