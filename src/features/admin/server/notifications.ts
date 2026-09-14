import "server-only";
import { idSchema, querySchema, type ListQuery } from "../schema";
import type { Notification } from "../types";
import { assertAdmin, type AdminActor } from "./auth";
import { getDatabase, writeStatement } from "./database";
import { timestamp } from "./records";

export async function unreadNotifications(actor: AdminActor) {
  assertAdmin(actor);
  return Number(
    (
      await getDatabase().execute(
        "SELECT count(*) AS total FROM notifications WHERE is_read=FALSE",
      )
    ).rows[0].total,
  );
}
export async function listNotifications(
  actor: AdminActor,
  input: Partial<ListQuery> = {},
) {
  assertAdmin(actor);
  const { page } = querySchema.parse(input);
  const result = await getDatabase().batch(
    [
      {
        sql: "SELECT n.*,m.name FROM notifications n JOIN contact_messages m ON m.id=n.message_id ORDER BY n.created_at DESC LIMIT 20 OFFSET ?",
        args: [(page - 1) * 20],
      },
      "SELECT count(*) AS total FROM notifications",
    ],
    "read",
  );
  const items: Notification[] = result[0].rows.map((r) => ({
    id: String(r.id),
    messageId: String(r.message_id),
    name: String(r.name),
    isRead: Boolean(r.is_read),
    createdAt: timestamp(r.created_at),
  }));
  return { items, total: Number(result[1].rows[0].total), page, pageSize: 20 };
}
export async function markNotificationRead(actor: AdminActor, id?: string) {
  assertAdmin(actor);
  if (id) idSchema.parse(id);
  await writeStatement(
    id
      ? { sql: "UPDATE notifications SET is_read=TRUE WHERE id=?", args: [id] }
      : "UPDATE notifications SET is_read=TRUE WHERE is_read=FALSE",
  );
}
