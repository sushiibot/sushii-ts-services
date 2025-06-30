export class UserLevel {
  constructor(
    private readonly userId: string,
    private readonly guildId: string,
    private xpAllTime: number,
    private xpMonth: number,
    private xpWeek: number,
    private xpDay: number,
    private lastMessageTime: Date,
  ) {}

  getUserId(): string {
    return this.userId;
  }

  getGuildId(): string {
    return this.guildId;
  }

  getAllTimeXp(): number {
    return this.xpAllTime;
  }

  getMonthXp(): number {
    return this.xpMonth;
  }

  getWeekXp(): number {
    return this.xpWeek;
  }

  getDayXp(): number {
    return this.xpDay;
  }

  getLastMessageTime(): Date {
    return this.lastMessageTime;
  }

  getCurrentLevel(): number {
    return this.levelFromXp(this.xpAllTime);
  }

  canGainXp(): boolean {
    const oneMinuteAgo = new Date(Date.now() - 60000);
    return this.lastMessageTime < oneMinuteAgo;
  }

  addXp(amount: number, currentTime: Date): number {
    if (!this.canGainXp()) {
      return this.getCurrentLevel();
    }

    const oldLevel = this.getCurrentLevel();

    this.xpAllTime += amount;
    this.resetTimeframeXpIfNeeded(amount, currentTime);
    this.lastMessageTime = currentTime;

    return oldLevel;
  }

  private resetTimeframeXpIfNeeded(amount: number, currentTime: Date): void {
    if (this.shouldResetDay(currentTime)) {
      this.xpDay = amount;
    } else {
      this.xpDay += amount;
    }

    if (this.shouldResetWeek(currentTime)) {
      this.xpWeek = amount;
    } else {
      this.xpWeek += amount;
    }

    if (this.shouldResetMonth(currentTime)) {
      this.xpMonth = amount;
    } else {
      this.xpMonth += amount;
    }
  }

  private shouldResetDay(currentTime: Date): boolean {
    return (
      this.lastMessageTime.getDate() !== currentTime.getDate() ||
      this.lastMessageTime.getMonth() !== currentTime.getMonth() ||
      this.lastMessageTime.getFullYear() !== currentTime.getFullYear()
    );
  }

  private shouldResetWeek(currentTime: Date): boolean {
    const lastWeek = this.getWeek(this.lastMessageTime);
    const currentWeek = this.getWeek(currentTime);

    return (
      lastWeek.week !== currentWeek.week || lastWeek.year !== currentWeek.year
    );
  }

  private shouldResetMonth(currentTime: Date): boolean {
    return (
      this.lastMessageTime.getMonth() !== currentTime.getMonth() ||
      this.lastMessageTime.getFullYear() !== currentTime.getFullYear()
    );
  }

  private getWeek(date: Date): { week: number; year: number } {
    const d = new Date(date);
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(
      ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
    );

    return { week: weekNo, year: d.getUTCFullYear() };
  }

  private levelFromXp(xp: number): number {
    return Math.floor((Math.sqrt(100 * (2 * xp + 25)) + 50) / 100);
  }

  static create(
    userId: string,
    guildId: string,
    initialXp: number = 5,
    currentTime: Date = new Date(),
  ): UserLevel {
    return new UserLevel(
      userId,
      guildId,
      initialXp,
      initialXp,
      initialXp,
      initialXp,
      currentTime,
    );
  }
}
