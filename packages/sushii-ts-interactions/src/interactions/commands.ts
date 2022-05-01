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

export default function addCommands(
  interactionClient: InteractionClient
): void {
  interactionClient.addCommands(
    new UserInfoCommand(),
    new FishyCommand(),
    new RepCommand(),
    new AvatarCommand(),

    // Meta
    new PingCommand(),

    // Moderation
    new BanCommand(),
    new KickCommand(),

    new NotificationCommand()
  );

  interactionClient.addContextMenu(new UserInfoHandler());

  interactionClient.addAutocomplete(new NotificationListAutocomplete());
}
