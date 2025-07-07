import InteractionClient from "@/core/cluster/discord/InteractionRouter";
import UserInfoCommand from "./user/userinfo";
import FishyCommand from "./user/fishy";
import RepCommand from "./user/rep";
import AvatarCommand from "./user/avatar";
import UserInfoHandler from "./moderation/context_lookup/LookupContextMenuHandler";
import StatusCommand from "../features/status/presentation/StatusCommand";
import BanCommand from "./moderation/BanCommand";
import KickCommand from "./moderation/KickCommand";
import NotificationCommand from "./notifications/NotificationCommand";
import NotificationListAutocomplete from "./notifications/Autocomplete";
import TagCommand from "./tags/TagCommand";
import TagGetAutocomplete from "./tags/TagAutocomplete";
import ContextLookUpButtonHandler from "./moderation/context_lookup/LookupComponentHandler";
import TimeoutCommand from "./moderation/TimeoutCommand";
import ReminderDeleteAutocomplete from "./reminders/ReminderAutocomplete";
import ReminderCommand from "./reminders/ReminderCommand";
import WarnCommand from "./moderation/WarnCommand";
import HistoryCommand from "./moderation/HistoryCommand";
import RoleMenuCommand from "./roles/RoleMenu";
import RoleMenuAutocomplete from "./roles/RoleMenuAutocomplete";
import RoleMenuButtonHandler from "./roles/RoleMenuButtonHandler";
import RoleMenuSelectMenuHandler from "./roles/RoleMenuSelectMenuHandler";
import UnbanCommand from "./moderation/UnbanCommand";
import PruneCommand from "./moderation/PruneCommand";
import SlowmodeCommand from "./moderation/SlowmodeCommand";
import NoteCommand from "./moderation/NoteCommand";
import XpCommand from "../features/leveling/presentation/XpCommands";
import LevelRoleCommand from "../features/leveling/presentation/LevelRoleCommand";
import RankCommand from "./user/rank";
import ModLogReasonButtonHandler from "./moderation/reason/ReasonButton";
import ModLogReasonModalHandler from "./moderation/reason/ReasonModal";
import ReasonCommand from "./moderation/reason/ReasonCommand";
import ReasonAutocomplete from "./moderation/reason/ReasonAutocomplete";
import UnTimeoutCommand from "./moderation/UnTimeoutCommand";
import UncaseCommand from "./moderation/reason/UncaseCommand";
import ReasonConfirmButtonHandler from "./moderation/reason/ReasonConfirmButtonHandler";
import SettingsCommand from "./settings/SettingsCommand";
import LookupCommand from "./moderation/LookupCommand";
import EmojiStatsCommand from "./emojis/EmojiStatsCommands";
import TagAdminCommand from "./tags/TagAdminCommand";
import BanPoolAutocomplete from "./moderation/ban_pools/BanPool.autocomplete";
import { config } from "@/core/shared/config";
import BanPoolCommand from "./moderation/ban_pools/BanPool.command";
import BannerCommand from "./user/banner";
import GiveawayCommand from "./giveaway/Giveaway.command";
import GiveawayButtonHandler from "./giveaway/Giveaway.button";
import GiveawayAutocomplete from "./giveaway/Giveaway.autocomplete";
import TempbanCommand from "./moderation/TempbanCommand";
import TempbanListCommand from "./moderation/TempbanListCommand";
import DeleteModLogDMButtonHandler from "./moderation/reason/DMButton";
import LeaderboardCommand from "../features/leveling/presentation/LeaderboardCommand";

export default function registerInteractionHandlers(
  interactionClient: InteractionClient,
): void {
  interactionClient.addCommands(
    // User
    new UserInfoCommand(),
    new FishyCommand(),
    new RepCommand(),
    new AvatarCommand(),
    new BannerCommand(),
    new RankCommand(),

    // Meta
    new StatusCommand(),

    // Moderation
    new BanCommand(),
    new UnbanCommand(),
    new TempbanCommand(),
    new TempbanListCommand(),
    new KickCommand(),
    new TimeoutCommand(),
    new UnTimeoutCommand(),
    new WarnCommand(),
    new NoteCommand(),
    new HistoryCommand(),
    new ReasonCommand(),
    new UncaseCommand(),
    new PruneCommand(),
    new SlowmodeCommand(),
    new LookupCommand(),

    // Guild
    new TagAdminCommand(),
    new EmojiStatsCommand(),
    new GiveawayCommand(),

    new NotificationCommand(),
    new ReminderCommand(),

    new LeaderboardCommand(),

    // Tags
    new TagCommand(),

    // Roles
    new RoleMenuCommand(),

    // XP
    new LevelRoleCommand(),
    new XpCommand(),

    // Settings
    new SettingsCommand(),
  );

  // ----------------------------------------
  // Autocomplete
  interactionClient.addAutocompleteHandlers(
    new NotificationListAutocomplete(),
    new TagGetAutocomplete(),
    new ReminderDeleteAutocomplete(),
    new RoleMenuAutocomplete(),
    new ReasonAutocomplete(),
    new GiveawayAutocomplete(),
  );

  // ----------------------------------------
  // Context menus
  interactionClient.addContextMenu(new UserInfoHandler());

  // ----------------------------------------
  // Buttons
  interactionClient.addButtons(
    new ContextLookUpButtonHandler(),
    new RoleMenuButtonHandler(),
    new ModLogReasonButtonHandler(),
    new DeleteModLogDMButtonHandler(),
    new ReasonConfirmButtonHandler(),
    new GiveawayButtonHandler(),
  );

  // ----------------------------------------
  // Select menus
  interactionClient.addSelectMenus(new RoleMenuSelectMenuHandler());

  // ----------------------------------------
  // Modals
  interactionClient.addModalHandlers(new ModLogReasonModalHandler());

  // ----------------------------------------
  // Feature flagged commands

  if (config.features.banPoolEnabled) {
    interactionClient.addCommand(new BanPoolCommand());
    interactionClient.addAutocompleteHandlers(new BanPoolAutocomplete());
  }
}
