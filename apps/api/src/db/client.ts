import { createClient as createDbClient } from "@indyer/db";
import type * as schema from "@indyer/db/schema";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

type Db = PostgresJsDatabase<typeof schema>;

let client: Db | null = null;

export function createClient(url: string) {
  client = createDbClient(url) as Db;
  return client;
}

export function getClient(): Db | null {
  return client;
}
