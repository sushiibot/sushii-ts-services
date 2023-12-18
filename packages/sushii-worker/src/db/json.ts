import { RawBuilder, sql } from "kysely";

export function json<T>(object: T): RawBuilder<string> {
  return sql`cast (${JSON.stringify(object)} as jsonb)`;
}
