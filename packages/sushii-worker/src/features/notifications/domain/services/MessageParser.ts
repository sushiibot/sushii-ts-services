export class MessageParser {
  static extractKeywords(messageContent: string): string[] {
    return messageContent
      .toLowerCase()
      .split(/\b(\w+)\b/g)
      .map((word) => word.trim())
      .filter(Boolean);
  }

  static containsKeyword(messageContent: string, keyword: string): boolean {
    const keywords = this.extractKeywords(messageContent);
    const cleanedKeyword = keyword.toLowerCase().trim();
    return keywords.includes(cleanedKeyword);
  }
}