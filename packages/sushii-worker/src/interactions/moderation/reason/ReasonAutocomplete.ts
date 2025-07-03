import {
  APIApplicationCommandOptionChoice,
  ApplicationCommandOptionType,
} from "discord-api-types/v10";
import { AutocompleteFocusedOption, AutocompleteInteraction } from "discord.js";
import logger from "../../../core/logger";
import Context from "../../../model/context";
import { AutocompleteHandler } from "../../handlers";
import { parseCaseId } from "./caseId";
import db from "../../../infrastructure/database/db";
import {
  getNextCaseId,
  getRecentModLogs,
  searchModLogsByIDPrefix,
} from "../../../db/ModLog/ModLog.repository";
import { ModLogRow } from "../../../db/ModLog/ModLog.table";

const MAX_CHOICE_NAME_LEN = 100;

function truncateWithEllipsis(str: string, len: number): string {
  if (str.length <= len) {
    return str;
  }

  return `${str.slice(0, len - 3)}...`;
}

export default class ReasonAutocomplete extends AutocompleteHandler {
  fullCommandNamePath = ["reason", "uncase"];

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: AutocompleteInteraction,
    option: AutocompleteFocusedOption,
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Must be in guild.");
    }

    if (option.type !== ApplicationCommandOptionType.String) {
      throw new Error("Option type must be a string.");
    }

    if (!option.value) {
      // Initial case - No value provided, list most recent cases
      const recentCases = await getRecentModLogs(db, {
        guildId: interaction.guildId,
      });

      logger.debug(
        {
          guildId: interaction.guildId,
          recentCount: recentCases.length || 0,
        },
        "empty case autocomplete",
      );

      const choices = this.formatCases(recentCases);

      await interaction.respond(choices || []);
      return;
    }

    // ignoreRangeOrder is true, meaning the endCaseId can be lower than the
    // startCaseId. This is necessary since user might be still typing a case
    // and we don't want it to flip around.
    const caseSpec = parseCaseId(option.value, true);
    if (!caseSpec) {
      // Invalid case
      await interaction.respond([
        {
          // Return with error message in autocomplete, but this can still
          // be sent by the user.
          name: "Invalid case range, examples: 123 or 123-150 or latest or latest~3",
          value: "invalid",
        },
      ]);

      return;
    }

    let choices: APIApplicationCommandOptionChoice<string>[];
    switch (caseSpec.type) {
      case "latest": {
        const recentCases = await getRecentModLogs(db, {
          guildId: interaction.guildId,
        });

        const nextCaseId = await getNextCaseId(db, interaction.guildId);
        const latestCaseId = nextCaseId - 1;

        //                          latestCaseId - selectedCaseId + 1
        // latest~1 = latest case - 100          - 100            + 1 = 1
        // latest~2 = latest 2    - 100          - 99             + 1 = 2
        choices = recentCases
          // Must be within latest 25 cases
          .filter((c) => parseInt(c.case_id, 10) > latestCaseId - 25)
          .map((s) => {
            const latestCount = latestCaseId - parseInt(s.case_id, 10) + 1;

            return {
              name: truncateWithEllipsis(
                `latest~${latestCount}: ${s.action} ${s.user_tag} - ${
                  s.reason || "No reason set"
                }`,
                MAX_CHOICE_NAME_LEN,
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
          const recentCases = await getRecentModLogs(db, {
            guildId: interaction.guildId,
          });

          endCases =
            recentCases.filter(
              // Only use cases that are > startId
              (c) => parseInt(c.case_id, 10) > caseSpec.startId,
            ) || [];
        } else {
          // Both start and end ID provided, we are just adding to the last
          // digit
          const cases = await searchModLogsByIDPrefix(db, {
            guildId: interaction.guildId,
            searchCaseId: caseSpec.endId,
          });

          endCases =
            cases.filter(
              // Only use cases that are > startId
              (c) => parseInt(c.case_id, 10) > caseSpec.startId,
            ) || [];
        }

        choices = endCases.slice(0, 25).map((s) => ({
          name: truncateWithEllipsis(
            `${caseSpec.startId}-${s.case_id}: ${s.action} ${s.user_tag} - ${
              s.reason || "No reason set"
            }`,
            MAX_CHOICE_NAME_LEN,
          ),
          value: `${caseSpec.startId}-${s.case_id}`,
        }));
        break;
      }
      case "single": {
        const cases = await searchModLogsByIDPrefix(db, {
          guildId: interaction.guildId,
          searchCaseId: caseSpec.id,
        });

        // Plain formatting
        choices = this.formatCases(cases);
      }
    }

    await interaction.respond(choices);
  }

  private formatCaseName(modLog: ModLogRow): string {
    const s = `${modLog.case_id}: ${modLog.action} ${modLog.user_tag} - ${
      modLog.reason || "No reason set"
    }`;

    return truncateWithEllipsis(s, MAX_CHOICE_NAME_LEN);
  }

  private formatCases(cases: ModLogRow[]): { name: string; value: string }[] {
    // Max 25, slice from 0 to end 25
    return cases.slice(0, 25).map((s) => ({
      name: this.formatCaseName(s),
      value: s.case_id,
    }));
  }
}
