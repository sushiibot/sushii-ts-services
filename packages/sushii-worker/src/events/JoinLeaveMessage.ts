import { Events, GuildMember, PartialGuildMember } from "discord.js";
import { EventHandlerFn } from "./EventHandler";
import Context from "../model/context";
import db from "../model/db";
import { getGuildConfig } from "../db/GuildConfig/GuildConfig.repository";

export const memberJoinMessageHandler: EventHandlerFn<
  Events.GuildMemberAdd
> = async (ctx: Context, member: GuildMember): Promise<void> => {
  const conf = await getGuildConfig(db, member.guild.id);

  if (!conf.msg_channel) {
    return;
  }

  if (!conf.join_msg_enabled || !conf.join_msg) {
    return;
  }

  const channel = member.guild.channels.cache.get(conf.msg_channel);
  if (!channel || !channel.isTextBased()) {
    return;
  }

  const msg = conf.join_msg
    .replace(/<username>/g, member.user.username)
    .replace(/<mention>/g, member.user.toString())
    .replace(/<server>/g, member.guild.name)
    .replace(/{member_number}/g, member.guild.memberCount.toString());

  await channel.send(msg);
};

export const memberLeaveMessageHandler: EventHandlerFn<
  Events.GuildMemberRemove
> = async (
  ctx: Context,
  member: GuildMember | PartialGuildMember,
): Promise<void> => {
  const conf = await getGuildConfig(db, member.guild.id);

  if (!conf.msg_channel) {
    return;
  }

  if (!conf.leave_msg_enabled || !conf.leave_msg) {
    return;
  }

  const channel = member.guild.channels.cache.get(conf.msg_channel);
  if (!channel || !channel.isTextBased()) {
    return;
  }

  const msg = conf.leave_msg
    .replace(/<username>/g, member.user.username)
    .replace(/<mention>/g, member.user.toString())
    .replace(/<server>/g, member.guild.name)
    .replace(/{member_number}/g, member.guild.memberCount.toString());

  await channel.send(msg);
};
