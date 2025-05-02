type TextCommand = {
  command: string;
  args: string[];
};

export function parseCommand(
  prefix: string,
  content: string,
): TextCommand | null {
  // Remove whitespace before prefix
  content = content.trim();

  // Get prefix
  if (!content.startsWith(prefix)) {
    return null;
  }

  // Remove prefix from command
  const command = content.slice(prefix.length).trim();

  // Prefix only message, no command
  if (!command) {
    return null;
  }

  const fullCommand = command.split(/ +/);

  // Empty somehow still
  if (fullCommand.length === 0) {
    return null;
  }

  const [commandName, ...rest] = fullCommand;

  return {
    command: commandName,
    args: rest,
  };
}
