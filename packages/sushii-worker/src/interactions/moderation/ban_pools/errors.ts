import { EmbedBuilder } from "discord.js";
import Color from "../../../utils/colors";

type ErrorType =
  | "INVITE_NOT_FOUND"
  | "INVITE_EXPIRED"
  | "POOL_NOT_FOUND"
  | "POOL_ALREADY_EXISTS"
  | "POOL_ALREADY_MEMBER"
  | "CANNOT_JOIN_OWN_POOL"
  | "GUILD_UNAVAILABLE";

export const notFoundBasic = new EmbedBuilder()
  .setTitle("Ban pool not found")
  .setDescription(
    "The ban pool you provided doesn't exist, please try another ban pool."
  )
  .setColor(Color.Error);

export const inviteNotFoundEmbed = new EmbedBuilder()
  .setTitle("Invite not found")
  .setDescription(
    "The invite code you provided is invalid or has expired. \
Check with the server that provided you with an invite code. They can use `/lookuppool invite` to create a new invite."
  )
  .setColor(Color.Error);

export const inviteExpiredEmbed = new EmbedBuilder()
  .setTitle("Invite expired")
  .setDescription(
    "The invite code you provided has expired. \
Check with the server that provided you with an invite code. They can use `/lookuppool invite` to create a new invite."
  )
  .setColor(Color.Error);

export const joinOwnPoolEmbed = new EmbedBuilder()
  .setTitle("Failed to join ban pool")
  .setDescription(
    "You cannot join your own ban pool, you are already a member of it!\n\
Use this code on another server, or join pools created by other servers if they provide you an invite."
  )
  .setColor(Color.Error);

export const joinPoolAlreadyMemberEmbed = new EmbedBuilder()
  .setTitle("Failed to join pool")
  .setDescription("You are already a member of this ban pool.")
  .setColor(Color.Error);

export const guildUnavailableEmbed = new EmbedBuilder()
  .setTitle("Failed to join ban pool")
  .setDescription(
    "Seems like that server that created the ban pool is no longer available, please try another invite or ensure they have sushii still in the server."
  )
  .setColor(Color.Error);

export const notFoundWithIDEmbed = new EmbedBuilder()
  .setTitle("Ban pool not found")
  .setDescription(
    "The ban pool you provided doesn't exist or you aren't part of it - please try another ban pool. \n\
If you're checking another server's pool, use the pool number ID instead of the name listed in `/lookuppool list`"
  )
  .setColor(Color.Error);

export class BanPoolError extends Error {
  public type: ErrorType;

  public embed: EmbedBuilder;

  constructor(type: ErrorType, message: string, embed: EmbedBuilder) {
    super(message);

    this.type = type;
    this.embed = embed;
  }
}