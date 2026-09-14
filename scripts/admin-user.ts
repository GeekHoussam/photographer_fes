import { randomUUID } from "node:crypto";
import { emitKeypressEvents } from "node:readline";
import { z } from "zod";
import {
  closeDatabase,
  getDatabase,
} from "../src/features/admin/server/database";
import { hashPassword } from "../src/features/admin/server/password";

const [command, emailArg, nameArg] = process.argv.slice(2);
if (
  !["create", "reset-password", "disable"].includes(command ?? "") ||
  !emailArg
) {
  console.error(
    "Usage: pnpm admin:user create <email> <name> | reset-password <email> | disable <email>\nPasswords are read privately from the terminal or standard input, never command arguments.",
  );
  process.exit(1);
}
const email = z.email().max(254).parse(emailArg).toLowerCase();
async function readPassword(): Promise<string> {
  if (!process.stdin.isTTY) {
    let input = "";
    for await (const chunk of process.stdin) {
      input += String(chunk);
      if (input.length > 1024) throw new Error("Password input is too long");
    }
    return input.replace(/\r?\n$/, "");
  }
  process.stdout.write("Password (15–256 characters; hidden): ");
  emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  return new Promise((resolve, reject) => {
    let value = "";
    const onKey = (text: string, key: { name?: string; ctrl?: boolean }) => {
      if (key.ctrl && key.name === "c") {
        finish();
        reject(new Error("Cancelled"));
      } else if (key.name === "return") {
        finish();
        resolve(value);
      } else if (key.name === "backspace") value = value.slice(0, -1);
      else if (text && !key.ctrl && value.length < 256) value += text;
    };
    const finish = () => {
      process.stdin.setRawMode(false);
      process.stdin.off("keypress", onKey);
      process.stdin.pause();
      process.stdout.write("\n");
    };
    process.stdin.on("keypress", onKey);
    process.stdin.resume();
  });
}
async function main() {
  const db = getDatabase();
  try {
    const timestamp = new Date().toISOString();
    if (command === "create") {
      const name = z.string().trim().min(2).max(200).parse(nameArg);
      const hash = await hashPassword(await readPassword());
      await db.execute({
        sql: "INSERT INTO admin_users(id,email,name,password_hash,role,created_at,updated_at) VALUES (?,?,?,?,'ADMIN',?,?)",
        args: [randomUUID(), email, name, hash, timestamp, timestamp],
      });
    } else {
      const row = (
        await db.execute({
          sql: "SELECT id FROM admin_users WHERE email=?",
          args: [email],
        })
      ).rows[0];
      if (!row) throw new Error("No matching administrator");
      const mutation =
        command === "disable"
          ? {
              sql: "UPDATE admin_users SET active=FALSE,updated_at=? WHERE id=?",
              args: [timestamp, row.id],
            }
          : {
              sql: "UPDATE admin_users SET password_hash=?,updated_at=? WHERE id=?",
              args: [
                await hashPassword(await readPassword()),
                timestamp,
                row.id,
              ],
            };
      await db.batch(
        [
          mutation,
          { sql: "DELETE FROM admin_sessions WHERE user_id=?", args: [row.id] },
        ],
        "write",
      );
    }
    console.info("Administrator operation completed.");
  } catch {
    console.error(
      "Administrator operation failed. Check the command, database setup, unique email and password requirements.",
    );
    process.exitCode = 1;
  } finally {
    await closeDatabase();
  }
}
void main().catch(() => {
  console.error(
    "Admin database setup failed. Check the documented configuration.",
  );
  process.exitCode = 1;
});
