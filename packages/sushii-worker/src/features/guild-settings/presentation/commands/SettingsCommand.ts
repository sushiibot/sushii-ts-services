import { sleep } from "bun";
import {
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  ChatInputCommandInteraction,
  InteractionContextType,
  MessageComponentInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  StringSelectMenuInteraction,
} from "discord.js";
import { ModalMessageModalSubmitInteraction } from "discord.js";
import { Logger } from "pino";

import { SlashCommandHandler } from "@/interactions/handlers";

import { GuildSettingsService } from "../../application/GuildSettingsService";
import { MessageLogService } from "../../application/MessageLogService";
import { ToggleableSetting } from "../../domain/entities/GuildConfig";
import {
  createSettingsMessage,
  formatButtonRejectionResponse,
} from "../views/SettingsMessageBuilder";
import {
  createJoinMessageModal,
  createLeaveMessageModal,
} from "../views/components/SettingsComponents";
import {
  SETTINGS_CUSTOM_IDS,
  SettingsPage,
} from "../views/components/SettingsConstants";

export default class SettingsCommand extends SlashCommandHandler {
  constructor(
    private readonly guildSettingsService: GuildSettingsService,
    private readonly messageLogService: MessageLogService,
    private readonly logger: Logger,
  ) {
    super();
  }

  command = new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Configure sushii server settings.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setContexts(InteractionContextType.Guild)
    .toJSON();

  async handler(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Guild not cached.");
    }

    return this.showSettingsPanel(interaction);
  }

  private async showSettingsPanel(
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const config = await this.guildSettingsService.getGuildSettings(
      interaction.guildId,
    );
    const messageLogBlocks = await this.messageLogService.getIgnoredChannels(
      interaction.guildId,
    );

    let currentPage: SettingsPage = "logging";

    const settingsMessage = createSettingsMessage({
      page: currentPage,
      config,
      messageLogBlocks,
      disabled: false,
    });

    const msg = await interaction.reply(settingsMessage);

    const collector = msg.createMessageComponentCollector({
      idle: 120000,
      dispose: true,
    });

    collector.on("collect", async (i) => {
      try {
        this.logger.debug(
          {
            interactionId: i.id,
            customId: i.customId,
            userId: i.user.id,
            guildId: interaction.guildId,
          },
          "Handling settings interaction",
        );

        if (i.user.id !== interaction.user.id) {
          const replied = await i.reply(formatButtonRejectionResponse());
          await sleep(2500);
          await replied.delete();
          return;
        }

        // Handle component interactions (modal submissions are handled separately)
        const updatedPage = await this.handleComponentInteraction(
          i,
          interaction.guildId,
        );

        if (updatedPage) {
          currentPage = updatedPage;
        }
      } catch (err) {
        this.logger.error(err, "Failed to handle settings interaction.");
      }
    });

    collector.on("end", async () => {
      try {
        const currentConfig = await this.guildSettingsService.getGuildSettings(
          interaction.guildId,
        );
        const currentBlocks = await this.messageLogService.getIgnoredChannels(
          interaction.guildId,
        );

        const disabledMessage = createSettingsMessage({
          page: currentPage,
          config: currentConfig,
          messageLogBlocks: currentBlocks,
          disabled: true,
        });

        await msg.edit(disabledMessage);
      } catch (err) {
        this.logger.error(err, "Failed to disable settings components.");
      }
    });
  }

  private async handleComponentInteraction(
    interaction: MessageComponentInteraction<"cached">,
    guildId: string,
  ): Promise<SettingsPage | undefined> {
    if (interaction.isStringSelectMenu()) {
      return this.handleStringSelectInteraction(interaction, guildId);
    }

    if (interaction.isChannelSelectMenu()) {
      return this.handleChannelSelectInteraction(interaction, guildId);
    }

    if (interaction.isButton()) {
      return this.handleButtonInteraction(interaction, guildId);
    }
  }

  private async handleStringSelectInteraction(
    interaction: StringSelectMenuInteraction<"cached">,
    guildId: string,
  ): Promise<SettingsPage | undefined> {
    if (interaction.customId === SETTINGS_CUSTOM_IDS.NAVIGATION) {
      const currentPage = interaction.values[0] as SettingsPage;
      const currentConfig =
        await this.guildSettingsService.getGuildSettings(guildId);
      const messageLogBlocks =
        await this.messageLogService.getIgnoredChannels(guildId);

      const updatedMessage = createSettingsMessage({
        page: currentPage,
        config: currentConfig,
        messageLogBlocks,
        disabled: false,
      });

      await interaction.update(updatedMessage);
      return currentPage;
    }
  }

  private async handleChannelSelectInteraction(
    interaction: ChannelSelectMenuInteraction<"cached">,
    guildId: string,
  ): Promise<SettingsPage | undefined> {
    // Handle multi-select message log ignore channels
    if (
      interaction.customId === SETTINGS_CUSTOM_IDS.MESSAGE_LOG_IGNORE_CHANNELS
    ) {
      await this.handleMessageLogIgnoreChannels(interaction, guildId);
      return "logging";
    }

    // Handle single-select channel menus for log channels
    return this.handleLogChannelSelection(interaction, guildId);
  }

  private async handleMessageLogIgnoreChannels(
    interaction: ChannelSelectMenuInteraction<"cached">,
    guildId: string,
  ): Promise<void> {
    const selectedChannelIds = interaction.values;
    const currentBlocks =
      await this.messageLogService.getIgnoredChannels(guildId);
    const currentChannelIds = currentBlocks.map((block) => block.channelId);

    // Remove channels that are no longer selected
    for (const block of currentBlocks) {
      if (!selectedChannelIds.includes(block.channelId)) {
        await this.messageLogService.removeIgnoredChannel(
          guildId,
          block.channelId,
        );
      }
    }

    // Add newly selected channels
    for (const channelId of selectedChannelIds) {
      if (!currentChannelIds.includes(channelId)) {
        await this.messageLogService.addIgnoredChannel(
          guildId,
          channelId,
          "all",
        );
      }
    }

    const updatedConfig =
      await this.guildSettingsService.getGuildSettings(guildId);
    const updatedBlocks =
      await this.messageLogService.getIgnoredChannels(guildId);

    const updatedMessage = createSettingsMessage({
      page: "logging",
      config: updatedConfig,
      messageLogBlocks: updatedBlocks,
      disabled: false,
    });

    await interaction.update(updatedMessage);
  }

  private async handleLogChannelSelection(
    interaction: ChannelSelectMenuInteraction<"cached">,
    guildId: string,
  ): Promise<SettingsPage> {
    const channelId = interaction.values[0];
    let logType: "mod" | "member" | "message" | "joinleave";
    let currentPage: SettingsPage;

    switch (interaction.customId) {
      case SETTINGS_CUSTOM_IDS.SET_MOD_LOG_CHANNEL:
        logType = "mod";
        currentPage = "logging";
        break;
      case SETTINGS_CUSTOM_IDS.SET_MEMBER_LOG_CHANNEL:
        logType = "member";
        currentPage = "logging";
        break;
      case SETTINGS_CUSTOM_IDS.SET_MESSAGE_LOG_CHANNEL:
        logType = "message";
        currentPage = "logging";
        break;
      case SETTINGS_CUSTOM_IDS.SET_JOIN_LEAVE_CHANNEL:
        logType = "joinleave";
        currentPage = "messages";
        break;
      default:
        throw new Error("Unknown channel select custom ID");
    }

    if (logType === "joinleave") {
      await this.guildSettingsService.updateMessageChannel(guildId, channelId);
    } else {
      await this.guildSettingsService.updateLogChannel(
        guildId,
        logType,
        channelId,
      );
    }

    const updatedConfig =
      await this.guildSettingsService.getGuildSettings(guildId);
    const updatedBlocks =
      await this.messageLogService.getIgnoredChannels(guildId);

    const updatedMessage = createSettingsMessage({
      page: currentPage,
      config: updatedConfig,
      messageLogBlocks: updatedBlocks,
      disabled: false,
    });

    await interaction.update(updatedMessage);
    return currentPage;
  }

  private async handleButtonInteraction(
    interaction: ButtonInteraction<"cached">,
    guildId: string,
  ): Promise<SettingsPage | undefined> {
    const currentConfig =
      await this.guildSettingsService.getGuildSettings(guildId);

    // Handle modal-triggering buttons
    if (interaction.customId === SETTINGS_CUSTOM_IDS.EDIT_JOIN_MESSAGE) {
      const modal = createJoinMessageModal(
        currentConfig.messageSettings.joinMessage,
      );
      await interaction.showModal(modal);

      try {
        const modalSubmission = await interaction.awaitModalSubmit({
          time: 120000, // 2 minutes
        });

        if (!modalSubmission.isFromMessage()) {
          throw new Error("Modal submission is not from a message interaction");
        }

        await this.handleModalSubmissionDirect(modalSubmission, guildId);
      } catch (err) {
        this.logger.debug(
          {
            interactionId: interaction.id,
            err,
          },
          "Join message modal submission timed out or failed",
        );
      }

      return undefined; // No page change for modal buttons
    }

    if (interaction.customId === SETTINGS_CUSTOM_IDS.EDIT_LEAVE_MESSAGE) {
      const modal = createLeaveMessageModal(
        currentConfig.messageSettings.leaveMessage,
      );
      await interaction.showModal(modal);

      try {
        const modalSubmission = await interaction.awaitModalSubmit({
          time: 120000, // 2 minutes
        });

        if (!modalSubmission.isFromMessage()) {
          throw new Error("Modal submission is not from a message interaction");
        }

        await this.handleModalSubmissionDirect(modalSubmission, guildId);
      } catch (err) {
        this.logger.debug(
          {
            interactionId: interaction.id,
            err,
          },
          "Leave message modal submission timed out or failed",
        );
      }

      return undefined; // No page change for modal buttons
    }

    // Handle toggle buttons
    const { setting, page } = this.getSettingAndPageFromButton(
      interaction.customId,
    );

    if (!setting) {
      throw new Error("Unknown button custom ID");
    }

    const updatedConfig = await this.guildSettingsService.toggleSetting(
      guildId,
      setting,
    );
    const messageLogBlocks =
      await this.messageLogService.getIgnoredChannels(guildId);

    const updatedMessage = createSettingsMessage({
      page,
      config: updatedConfig,
      messageLogBlocks,
      disabled: false,
    });

    await interaction.update(updatedMessage);
    return page;
  }

  private getSettingAndPageFromButton(customId: string): {
    setting: ToggleableSetting | null;
    page: SettingsPage;
  } {
    switch (customId) {
      case SETTINGS_CUSTOM_IDS.TOGGLE_MOD_LOG:
        return { setting: "modLog", page: "logging" };
      case SETTINGS_CUSTOM_IDS.TOGGLE_MEMBER_LOG:
        return { setting: "memberLog", page: "logging" };
      case SETTINGS_CUSTOM_IDS.TOGGLE_MESSAGE_LOG:
        return { setting: "messageLog", page: "logging" };
      case SETTINGS_CUSTOM_IDS.TOGGLE_JOIN_MSG:
        return { setting: "joinMessage", page: "messages" };
      case SETTINGS_CUSTOM_IDS.TOGGLE_LEAVE_MSG:
        return { setting: "leaveMessage", page: "messages" };
      case SETTINGS_CUSTOM_IDS.TOGGLE_LOOKUP_OPT_IN:
        return { setting: "lookupOptIn", page: "logging" };
      default:
        return { setting: null, page: "logging" };
    }
  }

  private async handleModalSubmissionDirect(
    interaction: ModalMessageModalSubmitInteraction<"cached">,
    guildId: string,
  ): Promise<void> {
    if (interaction.customId === SETTINGS_CUSTOM_IDS.EDIT_JOIN_MESSAGE) {
      const newMessage =
        interaction.fields.getTextInputValue("join_message_input");
      await this.guildSettingsService.updateJoinMessage(guildId, newMessage);
    } else if (
      interaction.customId === SETTINGS_CUSTOM_IDS.EDIT_LEAVE_MESSAGE
    ) {
      const newMessage = interaction.fields.getTextInputValue(
        "leave_message_input",
      );
      await this.guildSettingsService.updateLeaveMessage(guildId, newMessage);
    }

    // Update the original settings panel with the new config
    const updatedConfig =
      await this.guildSettingsService.getGuildSettings(guildId);
    const messageLogBlocks =
      await this.messageLogService.getIgnoredChannels(guildId);

    const updatedMessage = createSettingsMessage({
      page: "messages",
      config: updatedConfig,
      messageLogBlocks,
      disabled: false,
    });

    await interaction.update(updatedMessage);
  }
}
