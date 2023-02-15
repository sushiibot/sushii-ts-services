import {
  APIApplicationCommandAutocompleteGuildInteraction,
  APIApplicationCommandOptionChoice,
  ApplicationCommandOptionType,
  InteractionResponseType,
} from "discord-api-types/v10";
import { ModLog } from "../../../generated/generic";
import logger from "../../../logger";
import Context from "../../../model/context";
import { AutocompleteHandler } from "../../handlers";
import { AutocompleteOption } from "../../handlers/AutocompleteHandler";
import { parseCaseId } from "./caseId";

const MAX_CHOICE_NAME_LEN = 100;

function truncateWithEllipsis(str: string, len: number): string {
  if (str.length <= len) {
    return str;
  }

  return `${str.slice(0, len - 3)}...`;
}

export default class ReasonAutocomplete extends AutocompleteHandler {
  fullCommandNamePath = ["reason"];

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: APIApplicationCommandAutocompleteGuildInteraction,
    option: AutocompleteOption
  ): Promise<void> {
    if (option.type !== ApplicationCommandOptionType.String) {
      throw new Error("Option type must be a string.");
    }

    if (!option.value) {
      // Initial case - No value provided, list most recent cases
      const { allModLogs } = await ctx.sushiiAPI.sdk.getRecentModLogs({
        guildId: interaction.guild_id,
      });

      logger.debug(
        {
          guildId: interaction.guild_id,
          recentCount: allModLogs?.nodes.length || 0,
        },
        "empty case autocomplete"
      );

      const choices = this.formatCases(allModLogs?.nodes || []);

      await ctx.REST.interactionCallback(interaction, {
        type: InteractionResponseType.ApplicationCommandAutocompleteResult,
        data: {
          choices,
        },
      });

      return;
    }

    // ignoreRangeOrder is true, meaning the endCaseId can be lower than the
    // startCaseId. This is necessary since user might be still typing a case
    // and we don't want it to flip around.
    const caseSpec = parseCaseId(option.value, true);
    if (!caseSpec) {
      // Invalid case
      await ctx.REST.interactionCallback(interaction, {
        type: InteractionResponseType.ApplicationCommandAutocompleteResult,
        data: {
          choices: [
            {
              // Return with error message in autocomplete, but this can still
              // be sent by the user.
              name: "Invalid case range, examples: 123 or 123-150 or latest or latest~3",
              value: "invalid",
            },
          ],
        },
      });

      return;
    }

    let choices: APIApplicationCommandOptionChoice<string>[];
    switch (caseSpec.type) {
      case "latest": {
        const { allModLogs } = await ctx.sushiiAPI.sdk.getRecentModLogs({
          guildId: interaction.guild_id,
        });

        const { nextCaseId } = await ctx.sushiiAPI.sdk.getNextCaseID({
          guildId: interaction.guild_id,
        });

        if (!nextCaseId) {
          logger.warn(
            {
              guildId: interaction.guild_id,
              value: option.value,
            },
            "No next case ID found for reason latest autocomplete"
          );

          return;
        }

        const cases = allModLogs?.nodes.slice(0, 25) || [];

        const latestCaseId = parseInt(nextCaseId, 10) - 1;

        //                          latestCaseId - selectedCaseId + 1
        // latest~1 = latest case - 100          - 100            + 1 = 1
        // latest~2 = latest 2    - 100          - 99             + 1 = 2
        choices = cases
          // Must be within latest 25 cases
          .filter((c) => parseInt(c.caseId, 10) > latestCaseId - 25)
          .map((s) => {
            const latestCount = latestCaseId - parseInt(s.caseId, 10) + 1;

            return {
              name: truncateWithEllipsis(
                `latest~${latestCount} - ${s.action} ${s.userTag} - ${
                  s.reason || "No reason set"
                }`,
                MAX_CHOICE_NAME_LEN
              ),
              value: `latest~${latestCount}`,
            };
          });

        break;
      }
      case "range": {
        let endCases;

        // Searching for end ID now - should only include cases that are > startId
        if (!caseSpec.endId) {
          const { allModLogs } = await ctx.sushiiAPI.sdk.getRecentModLogs({
            guildId: interaction.guild_id,
          });

          endCases =
            allModLogs?.nodes.filter(
              // Only use cases that are > startId
              (c) => parseInt(c.caseId, 10) > caseSpec.startId
            ) || [];
        } else {
          // Both start and end ID provided, we are just adding to the last
          // digit
          const { searchModLogs } = await ctx.sushiiAPI.sdk.searchModLogs({
            guildId: interaction.guild_id,
            searchCaseId: caseSpec.endId.toString(),
          });

          endCases =
            searchModLogs?.nodes.filter(
              // Only use cases that are > startId
              (c) => parseInt(c.caseId, 10) > caseSpec.startId
            ) || [];
        }

        choices = endCases.slice(0, 25).map((s) => ({
          name: truncateWithEllipsis(
            `${caseSpec.startId}-${s.caseId} - ${s.action} ${s.userTag} - ${
              s.reason || "No reason set"
            }`,
            MAX_CHOICE_NAME_LEN
          ),
          value: `${caseSpec.startId}-${s.caseId}`,
        }));
        break;
      }
      case "single": {
        const { searchModLogs } = await ctx.sushiiAPI.sdk.searchModLogs({
          guildId: interaction.guild_id,
          searchCaseId: caseSpec.id.toString(),
        });

        const cases = searchModLogs?.nodes.slice(0, 25) || [];

        // Plain formatting
        choices = this.formatCases(cases);
      }
    }

    await ctx.REST.interactionCallback(interaction, {
      type: InteractionResponseType.ApplicationCommandAutocompleteResult,
      data: {
        choices,
      },
    });
  }

  private formatCaseName(
    modLog: Omit<ModLog, "nodeId" | "mutesByGuildIdAndCaseId">
  ): string {
    const s = `#${modLog.caseId} - ${modLog.action} ${modLog.userTag} - ${
      modLog.reason || "No reason set"
    }`;

    return truncateWithEllipsis(s, MAX_CHOICE_NAME_LEN);
  }

  private formatCases(
    cases: Omit<ModLog, "nodeId" | "mutesByGuildIdAndCaseId">[]
  ): { name: string; value: string }[] {
    // Max 25, slice from 0 to end 25
    return cases.slice(0, 25).map((s) => ({
      name: this.formatCaseName(s),
      value: s.caseId,
    }));
  }
}
