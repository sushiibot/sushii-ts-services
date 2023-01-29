import InteractionClient from "../client";
import UserInfoCommand from "./user/userinfo";
import FishyCommand from "./user/fishy";
import RepCommand from "./user/rep";
import AvatarCommand from "./user/avatar";
import UserInfoHandler from "./moderation/context_lookup/LookupContextMenuHandler";
import PingCommand from "./meta/ping";
import BanCommand from "./moderation/BanCommand";
import KickCommand from "./moderation/KickCommand";
import NotificationCommand from "./notifications/NotificationCommand";
import NotificationListAutocomplete from "./notifications/Autocomplete";
import TagCommand from "./tags/TagCommand";
import TagGetAutocomplete from "./tags/TagAutocomplete";
import ContextLookUpButtonHandler from "./moderation/context_lookup/LookupComponentHandler";
import WelcomeCommand from "./settings/WelcomeCommand";
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
import XpCommand from "./xp/XpCommands";
import LevelRoleCommand from "./xp/LevelRoleCommand";
import RankCommand from "./user/rank";
import MessageLogCommand from "./settings/MessageLogChannel";
import ModLogReasonButtonHandler from "./moderation/reason/ReasonButton";
import ModLogReasonModalHandler from "./moderation/reason/ReasonModal";
import ModLogCommand from "./settings/ModLogChannel";
import ReasonCommand from "./moderation/reason/ReasonCommand";
import ReasonAutocomplete from "./moderation/reason/ReasonAutocomplete";

export default function addCommands(
  interactionClient: InteractionClient
): void {
  interactionClient.addCommands(
    // User
    new UserInfoCommand(),
    new FishyCommand(),
    new RepCommand(),
    new AvatarCommand(),
    new RankCommand(),

    // Meta
    new PingCommand(),

    // Moderation
    new BanCommand(),
    new UnbanCommand(),
    new KickCommand(),
    new TimeoutCommand(),
    new WarnCommand(),
    new NoteCommand(),
    new HistoryCommand(),
    new ReasonCommand(),
    new PruneCommand(),
    new SlowmodeCommand(),

    new NotificationCommand(),
    new ReminderCommand(),

    // Tags
    new TagCommand(),

    // Roles
    new RoleMenuCommand(),

    // XP
    new LevelRoleCommand(),
    new XpCommand(),

    // Settings
    new WelcomeCommand(),
    new MessageLogCommand(),
    new ModLogCommand()
  );

  // ----------------------------------------
  // Autocomplete
  interactionClient.addAutocompleteHandlers(
    new NotificationListAutocomplete(),

    new TagGetAutocomplete(),

    new ReminderDeleteAutocomplete(),

    new RoleMenuAutocomplete(),

    new ReasonAutocomplete()
  );

  // ----------------------------------------
  // Context menus
  interactionClient.addContextMenu(new UserInfoHandler());

  // ----------------------------------------
  // Buttons
  interactionClient.addButtons(
    new ContextLookUpButtonHandler(),

    new RoleMenuButtonHandler(),

    new ModLogReasonButtonHandler()
  );

  // ----------------------------------------
  // Select menus
  interactionClient.addSelectMenus(new RoleMenuSelectMenuHandler());

  // ----------------------------------------
  // Modals
  interactionClient.addModalHandlers(new ModLogReasonModalHandler());
}
