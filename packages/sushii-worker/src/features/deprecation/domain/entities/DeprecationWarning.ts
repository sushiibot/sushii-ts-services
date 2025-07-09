/**
 * Domain entity representing a deprecation warning sent to a user
 */
export class DeprecationWarning {
  constructor(
    public readonly userId: string,
    public readonly lastWarnedAt: Date,
  ) {}

  /**
   * Check if enough time has passed since last warning (3 days)
   */
  canSendWarning(): boolean {
    const now = new Date();
    const timeSinceLastWarning = now.getTime() - this.lastWarnedAt.getTime();
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    
    return timeSinceLastWarning >= threeDaysInMs;
  }

  /**
   * Create a new warning with updated timestamp
   */
  updateWarningTime(): DeprecationWarning {
    return new DeprecationWarning(this.userId, new Date());
  }

  /**
   * Factory method to create a new warning for a user
   */
  static create(userId: string): DeprecationWarning {
    return new DeprecationWarning(userId, new Date());
  }
}