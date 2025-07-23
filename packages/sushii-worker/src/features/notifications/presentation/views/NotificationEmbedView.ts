import { EmbedBuilder, Message } from "discord.js";
import { Notification } from "../../domain/entities/Notification";
import Color from "@/utils/colors";
import SushiiEmoji from "@/shared/presentation/SushiiEmoji";
import { quoteMarkdownString } from "@/utils/markdown";
import { getUserString } from "@/utils/userString";

export function createNotificationEmbed(
  message: Message,
  notification: Notification,
): EmbedBuilder {
  const description = [
    `${SushiiEmoji.SpeechBubble} mentioned \`${notification.keyword}\` in ${message.url}`,
    "",
    quoteMarkdownString(message.content),
  ].join("\n");

  const avatar =
    message.member?.displayAvatarURL() || message.author.displayAvatarURL();

  return new EmbedBuilder()
    .setColor(Color.Info)
    .setAuthor({
      name: getUserString(message.member || message.author),
      iconURL: avatar,
    })
    .setDescription(description)
    .setTimestamp(new Date());
}