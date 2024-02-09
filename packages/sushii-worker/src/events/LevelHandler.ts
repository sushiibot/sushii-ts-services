import {
  DiscordAPIError,
  Events,
  Message,
  RESTJSONErrorCodes,
} from "discord.js";
import { sql } from "kysely";
import { z } from "zod";
import opentelemetry, { Span } from "@opentelemetry/api";
import logger from "../logger";
import Context from "../model/context";
import db from "../model/db";
import { EventHandlerFn } from "./EventHandler";
import { startCaughtActiveSpan } from "../tracing";

const tracer = opentelemetry.trace.getTracer("level-handler");
const log = logger.child({ module: "levelHandler" });

// Must match sql response, snake case
const UpdateUserXpResultSchema = z.object({
  old_level: z.string().optional().nullable(),
  new_level: z.string().optional().nullable(),
  add_role_ids: z.array(z.string()).optional().nullable(),
  remove_role_ids: z.array(z.string()).optional().nullable(),
});

type UpdateUserXpResult = z.infer<typeof UpdateUserXpResultSchema>;

const levelHandler: EventHandlerFn<Events.MessageCreate> = async (
  ctx: Context,
  msg: Message,
): Promise<void> =>
  startCaughtActiveSpan(tracer, "levelHandler", async () => {
    // Ignore dms
    if (!msg.inGuild()) {
      return;
    }

    // Ignore bots
    if (msg.author.bot) {
      return;
    }

    if (!msg.member) {
      // This shouldn't happen as member should exist in message create events.
      logger.warn(msg, "No member found for message");
      return;
    }

    // TODO: Convert the update_user_xp postgres function to kysely

    // guild_id   bigint,
    // channel_id bigint,
    // user_id    bigint,
    // role_ids   bigint[]
    const res = await tracer.startActiveSpan(
      "app_public.update_user_xp",
      (span: Span) => {
        try {
          return db
            .selectFrom(
              sql<UpdateUserXpResult>`app_public.update_user_xp(
          ${msg.guildId},
          ${msg.channelId},
          ${msg.author.id},
          ${msg.member?.roles.cache.map((r) => r.id)}
        )`.as("q"),
            )
            .selectAll()
            .executeTakeFirst();
        } finally {
          span.end();
        }
      },
    );

    // Parse to enforce schema matches, this throws if returned object doesn't match.
    // Discard result as we only care about checking error.
    UpdateUserXpResultSchema.parse(res);

    if (!res) {
      // Empty response
      logger.warn(
        {
          guildId: msg.guildId,
          channelId: msg.channelId,
          userId: msg.author.id,
        },
        "Empty response from update_user_xp",
      );
      return;
    }

    // Default empty add/remove roles
    const {
      old_level: oldLevel,
      new_level: newLevel,
      add_role_ids, // eslint-disable-line @typescript-eslint/naming-convention
      remove_role_ids, // eslint-disable-line @typescript-eslint/naming-convention
    } = res;

    if (!newLevel || !oldLevel) {
      // No xp updates, e.g. already sent message within past 1 minute
      return;
    }

    let addRoleIds: string[] = [];
    let removeRoleIds: string[] = [];
    if (add_role_ids) {
      addRoleIds = add_role_ids;
    }

    if (remove_role_ids) {
      removeRoleIds = remove_role_ids;
    }

    // Both empty, no role updates
    if (addRoleIds.length === 0 && removeRoleIds.length === 0) {
      return;
    }

    // New roles to assign to the member, including their current ones
    const newRoles = new Set(msg.member.roles.cache.keys() || []);

    for (const roleId of addRoleIds) {
      newRoles.add(roleId);
    }

    for (const roleId of removeRoleIds) {
      newRoles.delete(roleId);
    }

    // Do not do any api requests if there are no role changes, e.g. user already
    // has all eligible level roles.
    //
    // This is going to be the most common case. As the sushii API will always
    // return all level roles the user should have, instead of only when the
    // user levels up.
    //
    // Need to ensure the size matches, as if there are added roles, the second
    // part of the every() check will still be true.
    const noRoleChanges =
      newRoles.size === msg.member.roles.cache.size &&
      msg.member.roles.cache.every((r) => newRoles.has(r.id));
    if (noRoleChanges) {
      return;
    }

    await tracer.startActiveSpan("update_member_roles", async (span) => {
      try {
        await msg.member!.roles.set([...newRoles], `Level role ${newLevel}`);
      } catch (err) {
        if (err instanceof DiscordAPIError) {
          if (err.code === RESTJSONErrorCodes.MissingPermissions) {
            // Delete the level role ?

            log.warn(
              {
                guildId: msg.guildId,
                channelId: msg.channelId,
                userId: msg.author.id,
                err,
              },
              "Missing permissions to update member roles",
            );
          }
        }

        // Ignore error
        log.warn(
          {
            guildId: msg.guildId,
            channelId: msg.channelId,
            userId: msg.author.id,
            err,
          },
          "Failed to update member roles",
        );
      } finally {
        span.end();
      }
    });

    log.debug(
      {
        guildId: msg.guildId,
        channelId: msg.channelId,
        userId: msg.author.id,
        oldLevel,
        newLevel,
        addRoleIds,
        removeRoleIds,
        newMemberRoles: [...newRoles],
      },
      "Level role update",
    );
  });

export default levelHandler;
