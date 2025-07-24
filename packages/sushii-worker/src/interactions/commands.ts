import InteractionClient from "@/core/cluster/discord/InteractionRouter";
import { config } from "@/shared/infrastructure/config";

import LeaderboardCommand from "../features/leveling/presentation/commands/LeaderboardCommand";
import LevelRoleCommand from "../features/leveling/presentation/commands/LevelRoleCommand";
import XpCommand from "../features/leveling/presentation/commands/XpCommands";
import StatusCommand from "../features/status/presentation/StatusCommand";
import EmojiStatsCommand from "./emojis/EmojiStatsCommands";
import GiveawayAutocomplete from "./giveaway/Giveaway.autocomplete";
import GiveawayButtonHandler from "./giveaway/Giveaway.button";
import GiveawayCommand from "./giveaway/Giveaway.command";
import BanCommand from "./moderation/BanCommand";
import HistoryCommand from "./moderation/HistoryCommand";
import KickCommand from "./moderation/KickCommand";
import LookupCommand from "./moderation/LookupCommand";
import NoteCommand from "./moderation/NoteCommand";
import PruneCommand from "./moderation/PruneCommand";
import SlowmodeCommand from "./moderation/SlowmodeCommand";
import TempbanCommand from "./moderation/TempbanCommand";
import TempbanListCommand from "./moderation/TempbanListCommand";
import TimeoutCommand from "./moderation/TimeoutCommand";
import UnTimeoutCommand from "./moderation/UnTimeoutCommand";
import UnbanCommand from "./moderation/UnbanCommand";
import WarnCommand from "./moderation/WarnCommand";
import BanPoolAutocomplete from "./moderation/ban_pools/BanPool.autocomplete";
import BanPoolCommand from "./moderation/ban_pools/BanPool.command";
import ContextLookUpButtonHandler from "./moderation/context_lookup/LookupComponentHandler";
import UserInfoHandler from "./moderation/context_lookup/LookupContextMenuHandler";
import DeleteModLogDMButtonHandler from "./moderation/reason/DMButton";
import ReasonAutocomplete from "./moderation/reason/ReasonAutocomplete";
import ModLogReasonButtonHandler from "./moderation/reason/ReasonButton";
import ReasonCommand from "./moderation/reason/ReasonCommand";
import ModLogReasonModalHandler from "./moderation/reason/ReasonModal";
import UncaseCommand from "./moderation/reason/UncaseCommand";
import ReminderDeleteAutocomplete from "./reminders/ReminderAutocomplete";
import ReminderCommand from "./reminders/ReminderCommand";
import RoleMenuCommand from "./roles/RoleMenu";
import RoleMenuAutocomplete from "./roles/RoleMenuAutocomplete";
import RoleMenuButtonHandler from "./roles/RoleMenuButtonHandler";
import RoleMenuSelectMenuHandler from "./roles/RoleMenuSelectMenuHandler";
import AvatarCommand from "./user/avatar";
import BannerCommand from "./user/banner";
import FishyCommand from "./user/fishy";
import RepCommand from "./user/rep";
import UserInfoCommand from "./user/userinfo";

export default function registerInteractionHandlers(
  interactionRouter: InteractionClient,
): void {
  interactionRouter.addCommands(
    // User
    new UserInfoCommand(),
    new FishyCommand(),
    new RepCommand(),
    new AvatarCommand(),
    new BannerCommand(),

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
    new EmojiStatsCommand(),
    new GiveawayCommand(),

    new ReminderCommand(),

    new LeaderboardCommand(),

    // Roles
    new RoleMenuCommand(),

    // XP
    new LevelRoleCommand(),
    new XpCommand(),
  );

  // ----------------------------------------
  // Autocomplete
  interactionRouter.addAutocompleteHandlers(
    new ReminderDeleteAutocomplete(),
    new RoleMenuAutocomplete(),
    new ReasonAutocomplete(),
    new GiveawayAutocomplete(),
  );

  // ----------------------------------------
  // Context menus
  interactionRouter.addContextMenu(new UserInfoHandler());

  // ----------------------------------------
  // Buttons
  interactionRouter.addButtons(
    new ContextLookUpButtonHandler(),
    new RoleMenuButtonHandler(),
    new ModLogReasonButtonHandler(),
    new DeleteModLogDMButtonHandler(),
    new GiveawayButtonHandler(),
  );

  // ----------------------------------------
  // Select menus
  interactionRouter.addSelectMenus(new RoleMenuSelectMenuHandler());

  // ----------------------------------------
  // Modals
  interactionRouter.addModalHandlers(new ModLogReasonModalHandler());

  // ----------------------------------------
  // Feature flagged commands

  if (config.features.banPoolEnabled) {
    interactionRouter.addCommand(new BanPoolCommand());
    interactionRouter.addAutocompleteHandlers(new BanPoolAutocomplete());
  }
}
