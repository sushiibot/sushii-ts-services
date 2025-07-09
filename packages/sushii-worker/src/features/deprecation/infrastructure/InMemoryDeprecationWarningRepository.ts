import { DeprecationWarning } from "../domain/entities/DeprecationWarning";
import { DeprecationWarningRepository } from "../domain/repositories/DeprecationWarningRepository";

/**
 * In-memory implementation of DeprecationWarningRepository
 * Simple storage for rate limiting that resets on application restart
 */
export class InMemoryDeprecationWarningRepository implements DeprecationWarningRepository {
  private warnings = new Map<string, DeprecationWarning>();

  async findByUserId(userId: string): Promise<DeprecationWarning | null> {
    return this.warnings.get(userId) || null;
  }

  async save(warning: DeprecationWarning): Promise<void> {
    this.warnings.set(warning.userId, warning);
  }
}