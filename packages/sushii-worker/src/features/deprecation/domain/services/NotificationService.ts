/**
 * Simple command interface for notifications
 */
export interface SimpleCommand {
  readonly command: string;
  getFullCommand(): string;
}

/**
 * Domain service interface for sending deprecation notifications
 */
export interface NotificationService {
  /**
   * Send a deprecation warning to a user
   */
  sendDeprecationWarning(userId: string, command: SimpleCommand): Promise<void>;
}