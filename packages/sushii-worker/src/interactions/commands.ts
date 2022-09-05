import InteractionClient from "./client";
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

export default function addCommands(
  interactionClient: InteractionClient
): void {
  interactionClient.addCommands(
    // User
    new UserInfoCommand(),
    new FishyCommand(),
    new RepCommand(),
    new AvatarCommand(),

    // Meta
    new PingCommand(),

    // Moderation
    new BanCommand(),
    new UnbanCommand(),
    new KickCommand(),
    new TimeoutCommand(),
    new WarnCommand(),
    new HistoryCommand(),
    new PruneCommand(),

    new NotificationCommand(),
    new ReminderCommand(),

    // Tags
    new TagCommand(),

    // Roles
    new RoleMenuCommand(),

    // Settings
    new WelcomeCommand()
  );

  interactionClient.addContextMenu(new UserInfoHandler());

  interactionClient.addButtons(
    new ContextLookUpButtonHandler(),

    new RoleMenuButtonHandler()
  );

  interactionClient.addSelectMenus(new RoleMenuSelectMenuHandler());

  interactionClient.addAutocompleteHandlers(
    new NotificationListAutocomplete(),

    new TagGetAutocomplete(),

    new ReminderDeleteAutocomplete(),

    new RoleMenuAutocomplete()
  );
}
