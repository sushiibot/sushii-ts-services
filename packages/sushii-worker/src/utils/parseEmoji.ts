import { APIPartialEmoji } from "discord-api-types/v10";

const RE_EMOJI = /<(?<animated>a?)?:(?<name>\w+):(?<id>\d{17,20})>/;
const RE_EMOJI_UNICODE = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;

function parseUnicodeEmoji(s: string): APIPartialEmoji | null {
  const match = s.match(RE_EMOJI_UNICODE);

  if (!match) {
    return null;
  }

  return {
    id: null,
    name: match[0],
  };
}

export default function parseEmoji(s: string): APIPartialEmoji | null {
  const match = s.match(RE_EMOJI);

  if (!match || !match.groups) {
    // Fallback to unicode emoji
    return parseUnicodeEmoji(s);
  }

  const { animated, name, id } = match.groups;

  return {
    // Undefined if not animated
    animated: !!animated,
    id,
    name,
  };
}
