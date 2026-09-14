import "server-only";
import { Pool, type PoolClient, type QueryResultRow } from "pg";
import { AdminError } from "../errors";

export type DatabaseValue = string | number | boolean | null | Date;
export type Row = QueryResultRow;
export type Statement =
  string | { sql: string; args?: readonly DatabaseValue[] };
export type QueryResult = { rows: Row[]; rowsAffected: number };

export interface Transaction {
  execute(statement: Statement): Promise<QueryResult>;
  batch(statements: readonly Statement[]): Promise<QueryResult[]>;
  executeScript(sql: string): Promise<void>;
}

function postgresSql(sql: string, expectedArguments: number) {
  let output = "";
  let argument = 0;
  let quote: "'" | '"' | null = null;
  for (let index = 0; index < sql.length; index += 1) {
    const character = sql[index];
    if (quote) {
      output += character;
      if (character === quote) {
        if (sql[index + 1] === quote) output += sql[++index];
        else quote = null;
      }
    } else if (character === "'" || character === '"') {
      quote = character;
      output += character;
    } else if (character === "?") output += `$${++argument}`;
    else output += character;
  }
  if (argument !== expectedArguments)
    throw new Error("Database statement argument count does not match");
  return output;
}

class Executor implements Transaction {
  constructor(private readonly client: Pick<PoolClient, "query">) {}

  async execute(statement: Statement): Promise<QueryResult> {
    const sql = typeof statement === "string" ? statement : statement.sql;
    const args = typeof statement === "string" ? [] : (statement.args ?? []);
    const result = await this.client.query(postgresSql(sql, args.length), [
      ...args,
    ]);
    return { rows: result.rows, rowsAffected: result.rowCount ?? 0 };
  }

  async batch(statements: readonly Statement[]) {
    const results: QueryResult[] = [];
    for (const statement of statements)
      results.push(await this.execute(statement));
    return results;
  }

  async executeScript(sql: string) {
    if (sql.trim()) await this.client.query(sql);
  }
}

class Database extends Executor {
  constructor(private readonly pool: Pool) {
    super(pool);
  }

  async batch(
    statements: readonly Statement[],
    mode: "read" | "write" = "read",
  ) {
    return this.withTransaction(
      (tx) => tx.batch(statements),
      mode === "write" ? "serializable" : "repeatable read read only",
    );
  }

  async withTransaction<T>(
    work: (tx: Transaction) => Promise<T>,
    isolation = "serializable",
  ): Promise<T> {
    const retryable = isolation === "serializable";
    for (let attempt = 0; ; attempt += 1) {
      const client = await this.pool.connect();
      try {
        await client.query(`BEGIN ISOLATION LEVEL ${isolation.toUpperCase()}`);
        const result = await work(new Executor(client));
        await client.query("COMMIT");
        return result;
      } catch (error) {
        await client.query("ROLLBACK").catch(() => undefined);
        const code =
          error && typeof error === "object" && "code" in error
            ? String(error.code)
            : "";
        if (retryable && ["40001", "40P01"].includes(code) && attempt < 4) {
          await new Promise((resolve) =>
            setTimeout(resolve, 20 * 2 ** attempt + Math.random() * 20),
          );
          continue;
        }
        throw error;
      } finally {
        client.release();
      }
    }
  }

  async close() {
    await this.pool.end();
    if (database === this) database = undefined;
  }
}

let database: Database | undefined;

export function databaseConfigured() {
  return Boolean(process.env.ADMIN_DATABASE_URL);
}

function poolSize() {
  const value = Number(process.env.ADMIN_DATABASE_POOL_MAX ?? "10");
  if (!Number.isSafeInteger(value) || value < 1 || value > 30)
    throw new AdminError("setup_required", 503);
  return value;
}

export function getDatabase(): Database {
  if (database) return database;
  const connectionString = process.env.ADMIN_DATABASE_URL;
  if (!connectionString) throw new AdminError("setup_required", 503);
  let url: URL;
  try {
    url = new URL(connectionString);
  } catch {
    throw new AdminError("setup_required", 503);
  }
  if (
    !["postgres:", "postgresql:"].includes(url.protocol) ||
    !url.hostname ||
    url.pathname.length < 2
  )
    throw new AdminError("setup_required", 503);
  const pool = new Pool({
    connectionString,
    max: poolSize(),
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 30_000,
    statement_timeout: 10_000,
    application_name: "photographer-fes",
  });
  pool.on("error", () => console.error("An idle PostgreSQL connection failed"));
  database = new Database(pool);
  return database;
}

export function writeStatement(statement: Statement) {
  return transaction((tx) => tx.execute(statement));
}

export function writeBatch(statements: readonly Statement[]) {
  return transaction((tx) => tx.batch(statements));
}

export function transaction<T>(work: (tx: Transaction) => Promise<T>) {
  return getDatabase().withTransaction(work);
}

export async function closeDatabase() {
  await database?.close();
}
