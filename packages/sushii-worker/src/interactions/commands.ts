import InteractionClient from "@/core/cluster/discord/InteractionRouter";

import LeaderboardCommand from "../features/leveling/presentation/commands/LeaderboardCommand";
import LevelRoleCommand from "../features/leveling/presentation/commands/LevelRoleCommand";
import XpCommand from "../features/leveling/presentation/commands/XpCommands";
import StatusCommand from "../features/status/presentation/StatusCommand";
import EmojiStatsCommand from "./emojis/EmojiStatsCommands";
import GiveawayAutocomplete from "./giveaway/Giveaway.autocomplete";
import GiveawayButtonHandler from "./giveaway/Giveaway.button";
import GiveawayCommand from "./giveaway/Giveaway.command";
import DeleteModLogDMButtonHandler from "./moderation/reason/DMButton";
import ReasonAutocomplete from "./moderation/reason/ReasonAutocomplete";
import ModLogReasonButtonHandler from "./moderation/reason/ReasonButton";
import ReasonCommand from "./moderation/reason/ReasonCommand";
import ModLogReasonModalHandler from "./moderation/reason/ReasonModal";
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

    // Moderation (legacy commands not yet migrated to DDD)
    new ReasonCommand(),

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
  // Note: Context menus now handled by DDD features in bootstrap

  // ----------------------------------------
  // Buttons
  interactionRouter.addButtons(
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
}
