export interface TagFiltersData {
  guildId: string;
  startsWith?: string;
  contains?: string;
  ownerId?: string;
}

export class TagFilters {
  private constructor(
    private readonly guildId: string,
    private readonly startsWith?: string,
    private readonly contains?: string,
    private readonly ownerId?: string,
  ) {}

  static create(data: TagFiltersData): TagFilters {
    return new TagFilters(
      data.guildId,
      data.startsWith,
      data.contains,
      data.ownerId,
    );
  }

  static forGuild(guildId: string): TagFilters {
    return new TagFilters(guildId);
  }

  getGuildId(): string {
    return this.guildId;
  }

  getStartsWith(): string | undefined {
    return this.startsWith;
  }

  getContains(): string | undefined {
    return this.contains;
  }

  getOwnerId(): string | undefined {
    return this.ownerId;
  }

  hasFilters(): boolean {
    return !!(this.startsWith || this.contains || this.ownerId);
  }

  withStartsWith(startsWith: string): TagFilters {
    return new TagFilters(this.guildId, startsWith, undefined, this.ownerId);
  }

  withContains(contains: string): TagFilters {
    return new TagFilters(this.guildId, undefined, contains, this.ownerId);
  }

  withOwnerId(ownerId: string): TagFilters {
    return new TagFilters(
      this.guildId,
      this.startsWith,
      this.contains,
      ownerId,
    );
  }
}
