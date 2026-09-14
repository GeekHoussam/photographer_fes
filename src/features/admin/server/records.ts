import "server-only";
import type { Row, Transaction } from "./database";
import { randomUUID } from "node:crypto";
import type {
  ClientRecord,
  ContactMessage,
  DocumentSummary,
  FinancialDocument,
} from "../types";
import type { AdminActor } from "./auth";
import { AdminError } from "../errors";

export const now = () => new Date().toISOString();
export const today = () => now().slice(0, 10);
export const timestamp = (value: unknown) =>
  value instanceof Date ? value.toISOString() : String(value);
export const jsonRecord = (value: unknown) =>
  typeof value === "string" ? JSON.parse(value) : value;
export function required(row?: Row): Row {
  if (!row) throw new AdminError("not_found", 404);
  return row;
}
export function clientRecord(r: Row): ClientRecord {
  return {
    id: String(r.id),
    name: String(r.name),
    companyName: String(r.company_name),
    email: String(r.email),
    phone: String(r.phone),
    address: String(r.address),
    city: String(r.city),
    country: String(r.country),
    notes: String(r.notes),
    createdAt: timestamp(r.created_at),
    updatedAt: timestamp(r.updated_at),
  };
}
export function messageRecord(r: Row): ContactMessage {
  return {
    id: String(r.id),
    name: String(r.name),
    email: String(r.email),
    phone: String(r.phone),
    projectType: String(r.project_type),
    preferredDate: String(r.preferred_date),
    location: String(r.location),
    budget: String(r.budget),
    message: String(r.message),
    status: String(r.status),
    isRead: Boolean(r.is_read),
    emailStatus: String(r.email_status),
    createdAt: timestamp(r.created_at),
    updatedAt: timestamp(r.updated_at),
    repliedAt: r.replied_at ? timestamp(r.replied_at) : null,
  };
}
export const effectiveStatusSql = `CASE WHEN d.kind = 'INVOICE' AND d.status IN ('SENT','PARTIALLY_PAID','OVERDUE') AND d.due_date < CURRENT_DATE AND d.amount_paid < d.total THEN 'OVERDUE' WHEN d.kind = 'ESTIMATE' AND d.status = 'SENT' AND d.due_date < CURRENT_DATE THEN 'EXPIRED' ELSE d.status END`;
export function documentSummary(r: Row): DocumentSummary {
  return {
    id: String(r.id),
    number: String(r.number),
    clientName: String(r.client_name),
    status: String(r.effective_status ?? r.status),
    currency: String(r.currency) as FinancialDocument["currency"],
    total: Number(r.total),
    amountPaid: Number(r.amount_paid),
    issueDate: String(r.issue_date),
    dueDate: String(r.due_date),
    createdAt: timestamp(r.created_at),
  };
}
export async function audit(
  tx: Transaction,
  actor: AdminActor,
  action: string,
  id: string,
) {
  await tx.execute({
    sql: "INSERT INTO admin_audit(id,user_id,action,resource_id,created_at) VALUES (?,?,?,?,?)",
    args: [randomUUID(), actor.id, action, id, now()],
  });
}
