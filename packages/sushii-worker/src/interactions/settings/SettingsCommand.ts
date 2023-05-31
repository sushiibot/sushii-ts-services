import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import { AllSelection } from "kysely/dist/cjs/parser/select-parser";
import Context from "../../model/context";
import { SlashCommandHandler } from "../handlers";
import db from "../../model/db";
import SushiiEmoji from "../../constants/SushiiEmoji";
import { DB } from "../../model/dbTypes";
import Color from "../../utils/colors";

function toToggleButton(enabled?: boolean): string {
  return enabled ? SushiiEmoji.ToggleOn : SushiiEmoji.ToggleOff;
}

function formatTextOption(
  name: string,
  text: string | null,
  missingText: string,
  enabled?: boolean
): string {
  let s = "";
  s += toToggleButton(enabled);
  s += ` **${name}**\n`;
  s += `> ${text || missingText}`;
  s += "\n";

  return s;
}

function formatChannelOption(
  name: string,
  channel: string | null,
  missingText: string,
  enabled?: boolean
): string {
  let s = "";
  s += toToggleButton(enabled);
  s += ` **${name}**\n`;
  s += "> ";

  if (channel) {
    s += `<#${channel}>`;
  } else {
    s += missingText;
  }

  s += "\n";

  return s;
}

function getGuildConfigEmbed(
  config: AllSelection<DB, "app_public.guild_configs">
): EmbedBuilder {
  let embed = new EmbedBuilder()
    .setTitle("Server Settings")
    .setColor(Color.Info);

  let general = "";

  general += `**Prefix**: \`${config.prefix || "-"}\``;
  general += "\n";
  general +=
    "> Note: Commands are being migrated to slash commands, this is only for legacy commands that have not been migrated yet.";

  embed = embed.addFields([
    {
      name: "General",
      value: general,
      inline: false,
    },
  ]);

  // ---------------------------------------------------------------------------
  // Join / Leave messages

  let joinLeave = "";

  joinLeave += formatTextOption(
    "Join Message",
    config.join_msg,
    "No join message set.",
    config.join_msg_enabled
  );
  joinLeave += "\n";

  joinLeave += formatTextOption(
    "Leave Message",
    config.leave_msg,
    "No leave message set.",
    config.leave_msg_enabled
  );
  joinLeave += "\n";

  if (config.msg_channel) {
    joinLeave += `Join/Leave messages will be sent to <#${config.msg_channel}>`;
  } else {
    joinLeave +=
      "⚠️ Join/Leave message channel needs to be set with `/settings set msgchannel`";
  }

  embed = embed.addFields([
    {
      name: "Join/Leave Messages",
      value: joinLeave,
      inline: false,
    },
  ]);

  // ---------------------------------------------------------------------------
  // Logging

  let logging = "";

  logging += formatChannelOption(
    "Mod logs",
    config.log_mod,
    "No mod log channel set.",
    config.log_mod_enabled
  );
  logging += "\n";

  logging += formatChannelOption(
    "Member join/leave logs",
    config.log_member,
    "No member log channel set.",
    config.log_member_enabled
  );
  logging += "\n";

  logging += formatChannelOption(
    "Message logs",
    config.log_msg,
    "No message log channel set.",
    config.log_msg_enabled
  );
  logging += "\n";

  embed = embed.addFields([
    {
      name: "Logging",
      value: logging,
      inline: false,
    },
  ]);

  return embed;
}

export default class SettingsCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Configure sushii server settings.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addSubcommand((c) =>
      c.setName("view").setDescription("View the current server settings.")
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Guild not cached.");
    }

    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "view":
        return SettingsCommand.viewHandler(ctx, interaction);
      default:
        throw new Error("Invalid subcommand.");
    }
  }

  static async viewHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const config = await db.getGuildConfig(interaction.guildId);

    if (!config) {
      throw new Error("No config found.");
    }

    const embed = getGuildConfigEmbed(config);

    await interaction.reply({
      embeds: [embed.toJSON()],
    });
  }
}
