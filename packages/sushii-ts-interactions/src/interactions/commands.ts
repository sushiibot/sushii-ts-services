import InteractionClient from "./client";
import UserInfoCommand from "./user/userinfo";
import FishyCommand from "./user/fishy";
import RepCommand from "./user/rep";
import AvatarCommand from "./user/avatar";

export default function addCommands(
  interactionClient: InteractionClient
): void {
  interactionClient.addCommand(new UserInfoCommand());
  interactionClient.addCommand(new FishyCommand());
  interactionClient.addCommand(new RepCommand());
  interactionClient.addCommand(new AvatarCommand());
}
