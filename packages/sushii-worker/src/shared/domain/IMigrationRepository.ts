export interface IMigrationRepository {
  runMigrations(): Promise<void>;
}