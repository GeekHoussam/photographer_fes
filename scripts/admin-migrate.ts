import { resolve } from "node:path";
import { readFile, readdir } from "node:fs/promises";
import {
  closeDatabase,
  getDatabase,
} from "../src/features/admin/server/database";

async function main() {
  const db = getDatabase();
  try {
    await db.withTransaction(async (tx) => {
      await tx.execute(
        "SELECT pg_advisory_xact_lock(hashtext('photographer_fes_admin_migrations'))",
      );
      await tx.execute("SET LOCAL statement_timeout = 0");
      await tx.executeScript(`CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL
      )`);
      const applied = new Set(
        (await tx.execute("SELECT version FROM schema_migrations")).rows.map(
          (row) => String(row.version),
        ),
      );
      for (const file of (await readdir(resolve("db/migrations")))
        .filter((name) => name.endsWith(".sql"))
        .sort()) {
        if (applied.has(file)) continue;
        await tx.executeScript(
          await readFile(resolve("db/migrations", file), "utf8"),
        );
        await tx.execute({
          sql: "INSERT INTO schema_migrations(version,applied_at) VALUES (?,?)",
          args: [file, new Date().toISOString()],
        });
        console.info(`Applied ${file}`);
      }
    });
    console.info("PostgreSQL migrations are current.");
  } finally {
    await closeDatabase();
  }
}

void main().catch(() => {
  console.error(
    "Admin database setup failed. Check PostgreSQL, ADMIN_DATABASE_URL and the documented configuration.",
  );
  process.exitCode = 1;
});
