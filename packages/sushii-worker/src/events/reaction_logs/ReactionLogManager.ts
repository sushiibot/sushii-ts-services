import { Client } from "discord.js";

interface ReactionLog {
  action: "add" | "remove";
  reactionString: string;
  userId: string;
}

class ReactionLogManager {
  client: Client<true> | null;

  buffer: Map<string, ReactionLog[]>;

  timeout: NodeJS.Timeout | null;

  constructor() {
    this.client = null;
    this.buffer = new Map();
    this.timeout = null;
  }

  setClient(client: Client<true>): void {
    this.client = client;
  }

  async flushLogs(): Promise<void> {}

  private startFlushTimeout(): void {
    // Already has a timeout, don't need to start a new one
    if (this.timeout) {
      return;
    }

    // Create a new flush timeout
    this.timeout = setTimeout(() => {
      this.flushLogs();
    }, 5000);
  }

  addLog(
    guildId: string,
    userId: string,
    action: "add" | "remove",
    reactionString: string,
  ): void {
    const reactions = this.buffer.get(guildId) || [];
    reactions.push({
      action,
      reactionString,
      userId,
    });

    this.buffer.set(guildId, reactions);

    this.startFlushTimeout();
  }
}

let reactionLogManager = new ReactionLogManager();

export default reactionLogManager;
