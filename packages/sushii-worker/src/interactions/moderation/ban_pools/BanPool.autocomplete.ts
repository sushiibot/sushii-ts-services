import {
  APIApplicationCommandOptionChoice,
  ApplicationCommandOptionType,
} from "discord-api-types/v10";
import { AutocompleteFocusedOption, AutocompleteInteraction } from "discord.js";
import dayjs from "dayjs";
import Context from "../../../model/context";
import { AutocompleteHandler } from "../../handlers";
import { BanPoolOption, BanPoolOptionCommand } from "./BanPool.command";
import { getPoolByNameOrIdAndGuildId, searchGuildBanPools } from "./BanPool.repository";
import { searchBanPoolMemberships } from "./BanPoolMember.repository";
import { getAllBanPoolInvites } from "./BanPoolInvite.repository";
import toTimestamp from "../../../utils/toTimestamp";
import db from "../../../model/db";

export default class BanPoolAutocomplete extends AutocompleteHandler {
  fullCommandNamePath = [
    BanPoolOptionCommand.Show,
    BanPoolOptionCommand.Delete,
    BanPoolOptionCommand.Invite,
    BanPoolOptionCommand.DeleteInvite,
    BanPoolOptionCommand.ClearInvites,
  ].map((subcommand) => `banpool.${subcommand}`)

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: AutocompleteInteraction,
    option: AutocompleteFocusedOption
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Must be in guild.");
    }

    if (option.type !== ApplicationCommandOptionType.String) {
      throw new Error("Option type must be a string.");
    }

    const subcommand = interaction.options.getSubcommand()

    switch (option.name) {
      case BanPoolOption.PoolName: {
        // Should also show membership pools, not just owned pools
        if (subcommand === BanPoolOptionCommand.Show) {
          const poolOwnerships = await getPoolByNameOrIdAndGuildId(
            db,
            interaction.guildId,
            option.value,
          )

          const poolMemberships = await searchBanPoolMemberships(
            db,
            interaction.guildId,
            option.value,
            )

            const choices = poolMemberships.map(
              (pool): APIApplicationCommandOptionChoice =>  {
                const ownerGuild = interaction.client.guilds.cache.get(pool.owner_guild_id);

                return {
                name: `${pool.pool_name} - ${ownerGuild?.name || "Unknown owner server"}`,
                // Use ID since there could be duplicates
                value: pool.id,
              }
              }
            );

            await interaction.respond(choices);
            return;
        }

        // Don't show any memberships -- only owned pools
        const banPools = await searchGuildBanPools(
          db,
          interaction.guildId,
          option.value
        )

        const choices = banPools.map(
          (pool): APIApplicationCommandOptionChoice => ({
            name: pool.pool_name,
            value: pool.pool_name,
          })
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
            }
          ]);
          return;
        }

        const invites = await getAllBanPoolInvites(
          db,
          poolName,
          interaction.guildId
        )

        const choices = invites.map(
          (invite): APIApplicationCommandOptionChoice => {
            const expiresAt = invite.expires_at
              ? dayjs.utc(invite.expires_at)
              : null;

            let expiresStr
            if (expiresAt) {
              expiresStr = `Expires ${toTimestamp(expiresAt)}`
            } else {
              expiresStr = "Never expires"
            }

            return {
              name: `${invite.invite_code} - ${expiresStr}`,
              value: invite.invite_code,
            }
          }
        )

        await interaction.respond(choices);
        break;
      }
    }
  }
}