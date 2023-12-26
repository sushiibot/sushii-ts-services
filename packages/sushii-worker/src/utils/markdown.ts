export function quoteMarkdownString(str: string): string {
  return `> ${str.split("\n").join("\n> ")}`;
}
