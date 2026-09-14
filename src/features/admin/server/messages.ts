import "server-only";
import { randomUUID } from "node:crypto";
import type { ContactInput } from "@/features/contact/schema";
import { sendAdminReply } from "@/lib/email/send-admin-reply";
import { AdminError } from "../errors";
import {
  idSchema,
  messageStatuses,
  querySchema,
  replySchema,
  type ListQuery,
} from "../schema";
import type { MessageReply } from "../types";
import { assertAdmin, type AdminActor } from "./auth";
import {
  getDatabase,
  transaction,
  writeBatch,
  writeStatement,
} from "./database";
import { audit, messageRecord, now, required, timestamp } from "./records";

// Called only after the public route has validated origin, quota and schema.
// The message and its notification commit together; email is best-effort after.
export async function persistContactMessage(input: ContactInput) {
  const id = randomUUID();
  await writeBatch([
    {
      sql: "INSERT INTO contact_messages(id,name,email,phone,project_type,preferred_date,location,budget,message,consent,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,TRUE,?,?)",
      args: [
        id,
        input.name,
        input.email.toLowerCase(),
        input.phone ?? "",
        input.projectType,
        input.preferredDate ?? "",
        input.location,
        input.budget ?? "",
        input.message,
        now(),
        now(),
      ],
    },
    {
      sql: "INSERT INTO notifications(id,message_id,created_at) VALUES (?,?,?)",
      args: [randomUUID(), id, now()],
    },
  ]);
  return id;
}
export async function setContactEmailStatus(
  id: string,
  status: "SENT" | "FAILED" | "UNCONFIGURED",
) {
  await writeStatement({
    sql: "UPDATE contact_messages SET email_status=? WHERE id=?",
    args: [status, id],
  });
}
export async function listMessages(
  actor: AdminActor,
  input: Partial<ListQuery> = {},
  email?: string,
) {
  assertAdmin(actor);
  const { q, status, page } = querySchema.parse(input);
  const where = `WHERE position(lower(?) IN lower(name || ' ' || email || ' ' || message)) > 0
    AND (?='' OR (?='UNREAD' AND is_read=FALSE) OR status=?) AND (?='' OR lower(email)=lower(?))`;
  const args = [q, status, status, status, email ?? "", email ?? ""];
  const results = await getDatabase().batch(
    [
      {
        sql: `SELECT * FROM contact_messages ${where} ORDER BY created_at DESC LIMIT 20 OFFSET ?`,
        args: [...args, (page - 1) * 20],
      },
      { sql: `SELECT count(*) AS total FROM contact_messages ${where}`, args },
    ],
    "read",
  );
  return {
    items: results[0].rows.map(messageRecord),
    total: Number(results[1].rows[0].total),
    page,
    pageSize: 20,
  };
}
export async function getMessage(actor: AdminActor, id: string) {
  assertAdmin(actor);
  idSchema.parse(id);
  return messageRecord(
    required(
      (
        await getDatabase().execute({
          sql: "SELECT * FROM contact_messages WHERE id=?",
          args: [id],
        })
      ).rows[0],
    ),
  );
}
export async function getReplies(
  actor: AdminActor,
  id: string,
): Promise<MessageReply[]> {
  assertAdmin(actor);
  idSchema.parse(id);
  const result = await getDatabase().execute({
    sql: "SELECT id,content,status,created_at,sent_at FROM message_replies WHERE message_id=? ORDER BY created_at DESC LIMIT 50",
    args: [id],
  });
  return result.rows.map((r) => ({
    id: String(r.id),
    content: String(r.content),
    status: String(r.status),
    createdAt: timestamp(r.created_at),
    sentAt: r.sent_at ? timestamp(r.sent_at) : null,
  }));
}
export async function updateMessage(
  actor: AdminActor,
  id: string,
  update: { isRead?: boolean; status?: string },
) {
  assertAdmin(actor);
  idSchema.parse(id);
  if (
    update.status &&
    ![...messageStatuses].includes(
      update.status as (typeof messageStatuses)[number],
    )
  )
    throw new AdminError("validation");
  // REPLIED is exclusively set after successful provider acceptance.
  if (update.status && update.status !== "ARCHIVED")
    throw new AdminError("invalid_transition");
  await transaction(async (tx) => {
    const row = required(
      (
        await tx.execute({
          sql: "SELECT * FROM contact_messages WHERE id=?",
          args: [id],
        })
      ).rows[0],
    );
    const read =
      update.status === "ARCHIVED"
        ? true
        : (update.isRead ?? Boolean(row.is_read));
    const status =
      update.status ??
      (["NEW", "READ"].includes(String(row.status))
        ? read
          ? "READ"
          : "NEW"
        : String(row.status));
    await tx.execute({
      sql: "UPDATE contact_messages SET is_read=?,status=?,updated_at=? WHERE id=?",
      args: [read, status, now(), id],
    });
    await tx.execute({
      sql: "UPDATE notifications SET is_read=? WHERE message_id=?",
      args: [read, id],
    });
    await audit(
      tx,
      actor,
      update.status === "ARCHIVED" ? "message.archived" : "message.read_state",
      id,
    );
  });
}

export async function replyToMessage(
  actor: AdminActor,
  messageId: string,
  input: unknown,
) {
  assertAdmin(actor);
  idSchema.parse(messageId);
  const data = replySchema.parse(input);
  const message = await getMessage(actor, messageId);
  const shouldSend = await transaction(async (tx) => {
    const existing = (
      await tx.execute({
        sql: "SELECT * FROM message_replies WHERE id=?",
        args: [data.requestId],
      })
    ).rows[0];
    if (existing) {
      if (
        existing.message_id !== messageId ||
        existing.content !== data.content ||
        existing.user_id !== actor.id
      )
        throw new AdminError("conflict", 409);
      if (existing.status === "SENT") return false;
      const age = Date.now() - Date.parse(timestamp(existing.created_at));
      // Provider idempotency lasts 24 hours. Never replay an uncertain send later.
      if (
        age > 23 * 60 * 60 * 1000 ||
        (existing.status === "PENDING" && age < 2 * 60 * 1000)
      )
        throw new AdminError("reply_pending", 409);
      await tx.execute({
        sql: "UPDATE message_replies SET status='PENDING' WHERE id=?",
        args: [data.requestId],
      });
    } else {
      const recent = await tx.execute({
        sql: "SELECT count(*) AS total FROM message_replies WHERE user_id=? AND created_at>?",
        args: [actor.id, new Date(Date.now() - 60 * 60 * 1000).toISOString()],
      });
      if (Number(recent.rows[0].total) >= 30)
        throw new AdminError("rate_limited", 429);
      await tx.execute({
        sql: "INSERT INTO message_replies(id,message_id,user_id,content,status,created_at) VALUES (?,?,?,?,'PENDING',?)",
        args: [data.requestId, messageId, actor.id, data.content, now()],
      });
    }
    return true;
  });
  if (!shouldSend) return;
  let providerId: string;
  try {
    providerId = await sendAdminReply(
      message.email,
      data.content,
      data.requestId,
    );
  } catch (error) {
    await writeStatement({
      sql: "UPDATE message_replies SET status='FAILED' WHERE id=? AND status='PENDING'",
      args: [data.requestId],
    });
    if (error instanceof AdminError) throw error;
    throw new AdminError("email_failed", 502);
  }
  // If this commit fails, PENDING remains visible. Retrying the same request ID
  // recovers with the provider's idempotency key instead of sending a duplicate.
  await transaction(async (tx) => {
    await tx.execute({
      sql: "UPDATE message_replies SET status='SENT',provider_id=?,sent_at=? WHERE id=?",
      args: [providerId, now(), data.requestId],
    });
    await tx.execute({
      sql: "UPDATE contact_messages SET status='REPLIED',is_read=TRUE,replied_at=?,updated_at=? WHERE id=?",
      args: [now(), now(), messageId],
    });
    await tx.execute({
      sql: "UPDATE notifications SET is_read=TRUE WHERE message_id=?",
      args: [messageId],
    });
    await audit(tx, actor, "message.replied", messageId);
  });
}
