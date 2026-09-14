import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Locale } from "@/config/site";
import { getContactRateLimitKey } from "@/features/contact/rate-limit";
import { AdminError } from "../errors";
import { loginSchema } from "../schema";
import { getDatabase, transaction, writeStatement } from "./database";
import { verifyPassword } from "./password";

export const SESSION_COOKIE =
  process.env.NODE_ENV === "production"
    ? "__Host-admin-session"
    : "admin-session";
export const SESSION_SECONDS = 8 * 60 * 60;
export type AdminActor = {
  id: string;
  name: string;
  email: string;
  role: string;
  locale: Locale;
};
export function assertAdmin(
  actor: AdminActor | null,
): asserts actor is AdminActor {
  if (!actor) throw new AdminError("unauthorized", 401);
  if (actor.role !== "ADMIN") throw new AdminError("forbidden", 403);
}
const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex");

export async function sessionActor(token?: string): Promise<AdminActor | null> {
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
  const result = await getDatabase().execute({
    sql: `SELECT u.id, u.email, u.name, u.role, u.locale FROM admin_sessions s
      JOIN admin_users u ON u.id = s.user_id
      WHERE s.token_hash = ? AND s.expires_at > ? AND u.active = TRUE`,
    args: [digest(token), Date.now()],
  });
  const row = result.rows[0];
  if (!row) return null;
  return {
    id: String(row.id),
    email: String(row.email),
    name: String(row.name),
    role: String(row.role),
    locale: String(row.locale) as Locale,
  };
}

export const currentActor = cache(async () =>
  sessionActor((await cookies()).get(SESSION_COOKIE)?.value),
);
export async function requireAdmin() {
  const actor = await currentActor();
  if (!actor || actor.role !== "ADMIN") redirect("/admin/login");
  return actor;
}

async function loginQuota(keys: string[]) {
  return transaction(async (tx) => {
    const now = Date.now();
    await tx.execute({
      sql: "DELETE FROM admin_rate_limits WHERE reset_at <= ?",
      args: [now],
    });
    let allowed = true;
    for (const key of keys) {
      const result = await tx.execute({
        sql: `INSERT INTO admin_rate_limits(key, attempts, reset_at) VALUES (?, 1, ?)
          ON CONFLICT(key) DO UPDATE SET attempts = admin_rate_limits.attempts + 1
          RETURNING admin_rate_limits.attempts AS attempts`,
        args: [key, now + 15 * 60 * 1000],
      });
      if (Number(result.rows[0].attempts) > 10) allowed = false;
    }
    return allowed;
  });
}

export async function login(input: unknown, headers: Headers) {
  const data = loginSchema.parse(input);
  const ip = getContactRateLimitKey(headers);
  if (
    !(await loginQuota([`login:ip:${ip}`, `login:email:${digest(data.email)}`]))
  )
    throw new AdminError("rate_limited", 429);
  const result = await getDatabase().execute({
    sql: "SELECT * FROM admin_users WHERE email = ?",
    args: [data.email],
  });
  const row = result.rows[0];
  const valid = await verifyPassword(
    data.password,
    row ? String(row.password_hash) : undefined,
  );
  if (!valid || !row || row.role !== "ADMIN" || row.active !== true)
    throw new AdminError("invalid_credentials", 401);
  const token = randomBytes(32).toString("base64url");
  await transaction(async (tx) => {
    // A reset or disable during the password derivation must not issue a new session.
    const inserted = await tx.execute({
      sql: `INSERT INTO admin_sessions(token_hash,user_id,expires_at,created_at)
        SELECT ?,id,?,? FROM admin_users WHERE id=? AND password_hash=? AND role='ADMIN' AND active=TRUE`,
      args: [
        digest(token),
        Date.now() + SESSION_SECONDS * 1000,
        new Date().toISOString(),
        row.id,
        row.password_hash,
      ],
    });
    if (!inserted.rowsAffected)
      throw new AdminError("invalid_credentials", 401);
    await tx.execute({
      sql: "DELETE FROM admin_sessions WHERE expires_at<=?",
      args: [Date.now()],
    });
  });
  return { token, locale: String(row.locale) as Locale };
}

export async function logout(token?: string) {
  if (token)
    await writeStatement({
      sql: "DELETE FROM admin_sessions WHERE token_hash = ?",
      args: [digest(token)],
    });
}
