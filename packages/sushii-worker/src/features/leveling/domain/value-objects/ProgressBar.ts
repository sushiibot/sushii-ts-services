export class ProgressBar {
  private static readonly FILLED_CHAR = "▰";
  private static readonly EMPTY_CHAR = "▱";
  private static readonly DEFAULT_LENGTH = 10;

  constructor(
    private readonly percentage: number,
    private readonly length: number = ProgressBar.DEFAULT_LENGTH,
  ) {
    if (percentage < 0 || percentage > 100) {
      throw new Error("Percentage must be between 0 and 100");
    }
    if (length <= 0) {
      throw new Error("Length must be positive");
    }
  }

  static fromPercentage(percentage: number, length?: number): ProgressBar {
    return new ProgressBar(percentage, length);
  }

  static fromProgress(
    current: number,
    total: number,
    length?: number,
  ): ProgressBar {
    if (total === 0) return new ProgressBar(0, length);
    const percentage = (current / total) * 100;
    return new ProgressBar(percentage, length);
  }

  render(): string {
    const filled = Math.floor((this.percentage / 100) * this.length);
    const empty = this.length - filled;

    return (
      ProgressBar.FILLED_CHAR.repeat(filled) +
      ProgressBar.EMPTY_CHAR.repeat(empty)
    );
  }

  getPercentage(): number {
    return this.percentage;
  }

  getLength(): number {
    return this.length;
  }
}
