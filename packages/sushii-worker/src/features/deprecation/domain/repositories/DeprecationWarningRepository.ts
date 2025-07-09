import { DeprecationWarning } from "../entities/DeprecationWarning";

/**
 * Repository interface for managing deprecation warnings
 */
export interface DeprecationWarningRepository {
  /**
   * Find the last warning for a user
   */
  findByUserId(userId: string): Promise<DeprecationWarning | null>;

  /**
   * Save or update a deprecation warning
   */
  save(warning: DeprecationWarning): Promise<void>;
}