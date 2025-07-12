export class XpAmount {
  private constructor(private readonly value: bigint) {
    if (value < 0n) {
      throw new Error("XP amount cannot be negative");
    }
  }

  static from(value: bigint | number | string): XpAmount {
    const bigintValue = typeof value === "bigint" ? value : BigInt(value);
    return new XpAmount(bigintValue);
  }

  getValue(): bigint {
    return this.value;
  }

  getNumericValue(): number {
    return Number(this.value);
  }

  toString(): string {
    return this.value.toString();
  }

  add(other: XpAmount): XpAmount {
    return new XpAmount(this.value + other.value);
  }

  subtract(other: XpAmount): XpAmount {
    const result = this.value - other.value;
    if (result < 0n) {
      throw new Error("Cannot subtract to negative XP amount");
    }
    return new XpAmount(result);
  }

  equals(other: XpAmount): boolean {
    return this.value === other.value;
  }

  isGreaterThan(other: XpAmount): boolean {
    return this.value > other.value;
  }

  isLessThan(other: XpAmount): boolean {
    return this.value < other.value;
  }
}
