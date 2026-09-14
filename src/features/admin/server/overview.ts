import "server-only";
import { assertAdmin, type AdminActor } from "./auth";
import { getDatabase } from "./database";
import { documentSummary, effectiveStatusSql, messageRecord } from "./records";

export async function getOverview(actor: AdminActor) {
  assertAdmin(actor);
  const [counts, messages, estimates, invoices] = await getDatabase().batch(
    [
      `SELECT (SELECT count(*) FROM clients) AS clients,
      (SELECT count(*) FROM documents WHERE kind='ESTIMATE') AS estimates,
      (SELECT count(*) FROM documents WHERE kind='ESTIMATE' AND (status='DRAFT' OR (status='SENT' AND due_date>=CURRENT_DATE))) AS "pendingEstimates",
      (SELECT count(*) FROM documents WHERE kind='INVOICE') AS invoices,
      (SELECT count(*) FROM documents WHERE kind='INVOICE' AND status='PAID') AS "paidInvoices",
      (SELECT count(*) FROM documents WHERE kind='INVOICE' AND status IN ('SENT','PARTIALLY_PAID','OVERDUE')) AS "unpaidInvoices",
      (SELECT count(*) FROM contact_messages WHERE is_read=FALSE) AS "unreadMessages"`,
      "SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5",
      `SELECT d.*,c.name AS client_name,${effectiveStatusSql} AS effective_status FROM documents d JOIN clients c ON c.id=d.client_id WHERE d.kind='ESTIMATE' ORDER BY d.created_at DESC LIMIT 5`,
      `SELECT d.*,c.name AS client_name,${effectiveStatusSql} AS effective_status FROM documents d JOIN clients c ON c.id=d.client_id WHERE d.kind='INVOICE' ORDER BY d.created_at DESC LIMIT 5`,
    ],
    "read",
  );
  return {
    counts: Object.fromEntries(
      Object.entries(counts.rows[0]).map(([key, value]) => [
        key,
        Number(value),
      ]),
    ),
    messages: messages.rows.map(messageRecord),
    estimates: estimates.rows.map(documentSummary),
    invoices: invoices.rows.map(documentSummary),
  };
}
