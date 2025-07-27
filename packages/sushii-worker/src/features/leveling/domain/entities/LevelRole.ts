export class LevelRole {
  constructor(
    private readonly guildId: string,
    private readonly roleId: string,
    private readonly addLevel: number | null,
    private readonly removeLevel: number | null,
  ) {}

  getGuildId(): string {
    return this.guildId;
  }

  getRoleId(): string {
    return this.roleId;
  }

  getAddLevel(): number | null {
    return this.addLevel;
  }

  getRemoveLevel(): number | null {
    return this.removeLevel;
  }

  shouldAddRole(level: number): boolean {
    return (
      this.addLevel !== null &&
      level >= this.addLevel &&
      (this.removeLevel === null || level < this.removeLevel)
    );
  }

  shouldRemoveRole(level: number): boolean {
    return this.removeLevel !== null && level >= this.removeLevel;
  }
}
