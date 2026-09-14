import "server-only";
import { randomUUID } from "node:crypto";
import type { Row, Transaction } from "./database";
import { z } from "zod";
import { AdminError } from "../errors";
import { calculateDocument, decimalFromMinor, scaled } from "../money";
import {
  documentSchema,
  idSchema,
  querySchema,
  type DocumentInput,
  type DocumentKind,
  type ListQuery,
} from "../schema";
import type { FinancialDocument } from "../types";
import { assertAdmin, type AdminActor } from "./auth";
import { getDatabase, transaction } from "./database";
import {
  audit,
  clientRecord,
  documentSummary,
  effectiveStatusSql,
  jsonRecord,
  now,
  required,
  timestamp,
  today,
} from "./records";
import { readSettings } from "./settings";

const revisionSchema = z.number().int().positive();
export async function listDocuments(
  actor: AdminActor,
  kind: DocumentKind,
  input: Partial<ListQuery> = {},
  clientId?: string,
) {
  assertAdmin(actor);
  const query = querySchema.parse(input);
  const { q, status, page } = query;
  clientId = clientId || query.clientId || undefined;
  if (clientId) idSchema.parse(clientId);
  const where = `WHERE d.kind=? AND position(lower(?) IN lower(d.number || ' ' || c.name || ' ' || c.email)) > 0
    AND (?='' OR (${effectiveStatusSql})=?) AND (?::uuid IS NULL OR d.client_id=?)`;
  const args = [kind, q, status, status, clientId ?? null, clientId ?? null];
  const results = await getDatabase().batch(
    [
      {
        sql: `SELECT d.*, c.name AS client_name, ${effectiveStatusSql} AS effective_status FROM documents d JOIN clients c ON c.id=d.client_id ${where} ORDER BY d.created_at DESC LIMIT 20 OFFSET ?`,
        args: [...args, (page - 1) * 20],
      },
      {
        sql: `SELECT count(*) AS total FROM documents d JOIN clients c ON c.id=d.client_id ${where}`,
        args,
      },
    ],
    "read",
  );
  return {
    items: results[0].rows.map(documentSummary),
    total: Number(results[1].rows[0].total),
    page,
    pageSize: 20,
  };
}

function mapDocument(row: Row, items: Row[]): FinancialDocument {
  return {
    ...documentSummary({ ...row, client_name: "" }),
    kind: String(row.kind) as DocumentKind,
    clientId: String(row.client_id),
    sourceEstimateId: row.source_estimate_id
      ? String(row.source_estimate_id)
      : null,
    client: jsonRecord(row.client_snapshot),
    issuer: jsonRecord(row.issuer_snapshot),
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    tax: Number(row.tax),
    notes: String(row.notes),
    terms: String(row.terms),
    revision: Number(row.revision),
    updatedAt: timestamp(row.updated_at),
    items: items.map((i) => ({
      description: String(i.description),
      quantity: String(i.quantity),
      unitPrice: String(i.unit_price),
      taxRate: String(i.tax_rate),
      subtotal: Number(i.subtotal),
      discount: Number(i.discount),
      tax: Number(i.tax),
      total: Number(i.total),
    })),
  };
}
async function readDocument(
  db: Pick<Transaction, "execute">,
  kind: DocumentKind,
  id: string,
) {
  const row = required(
    (
      await db.execute({
        sql: `SELECT d.*, ${effectiveStatusSql} AS effective_status FROM documents d WHERE d.id=? AND d.kind=?`,
        args: [id, kind],
      })
    ).rows[0],
  );
  const items = await db.execute({
    sql: "SELECT * FROM document_items WHERE document_id=? ORDER BY position",
    args: [id],
  });
  return mapDocument(row, items.rows);
}
export async function getDocument(
  actor: AdminActor,
  kind: DocumentKind,
  id: string,
) {
  assertAdmin(actor);
  idSchema.parse(id);
  const [document, items] = await getDatabase().batch(
    [
      {
        sql: `SELECT d.*, ${effectiveStatusSql} AS effective_status FROM documents d WHERE d.id=? AND d.kind=?`,
        args: [id, kind],
      },
      {
        sql: "SELECT * FROM document_items WHERE document_id=? ORDER BY position",
        args: [id],
      },
    ],
    "read",
  );
  return mapDocument(required(document.rows[0]), items.rows);
}

async function writeItems(
  tx: Transaction,
  id: string,
  items: ReturnType<typeof calculateDocument>["items"],
) {
  await tx.execute({
    sql: "DELETE FROM document_items WHERE document_id=?",
    args: [id],
  });
  await tx.batch(
    items.map((item, position) => ({
      sql: "INSERT INTO document_items(id,document_id,position,description,quantity,unit_price,tax_rate,subtotal,discount,tax,total) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
      args: [
        randomUUID(),
        id,
        position,
        item.description,
        item.quantity,
        item.unitPrice,
        item.taxRate,
        item.subtotal,
        item.discount,
        item.tax,
        item.total,
      ],
    })),
  );
}

async function insertDocument(
  tx: Transaction,
  kind: DocumentKind,
  data: DocumentInput,
  source?: FinancialDocument,
) {
  const totals = calculateDocument(data);
  const client =
    source?.client ??
    clientRecord(
      required(
        (
          await tx.execute({
            sql: "SELECT * FROM clients WHERE id=?",
            args: [data.clientId],
          })
        ).rows[0],
      ),
    );
  const issuer = await readSettings(tx);
  const year = data.issueDate.slice(0, 4);
  const counter = await tx.execute({
    sql: "INSERT INTO document_sequences(kind,year,value) VALUES (?,?,1) ON CONFLICT(kind,year) DO UPDATE SET value=document_sequences.value+1 RETURNING document_sequences.value AS value",
    args: [kind, year],
  });
  const number = `${kind === "ESTIMATE" ? "DEV" : "INV"}-${year}-${String(counter.rows[0].value).padStart(4, "0")}`;
  const id = randomUUID();
  await tx.execute({
    sql: `INSERT INTO documents(id,kind,number,client_id,source_estimate_id,client_snapshot,issuer_snapshot,issue_date,due_date,status,currency,subtotal,discount,tax,total,notes,terms,created_at,updated_at)
      VALUES (?,?,?,?,?,?,?,?,?,'DRAFT',?,?,?,?,?,?,?,?,?)`,
    args: [
      id,
      kind,
      number,
      data.clientId,
      source?.id ?? null,
      JSON.stringify(client),
      JSON.stringify(issuer),
      data.issueDate,
      data.dueDate,
      data.currency,
      totals.subtotal,
      totals.discount,
      totals.tax,
      totals.total,
      data.notes,
      data.terms,
      now(),
      now(),
    ],
  });
  await writeItems(tx, id, totals.items);
  return { id };
}

export async function saveDocument(
  actor: AdminActor,
  kind: DocumentKind,
  input: unknown,
  id?: string,
  revision?: number,
) {
  assertAdmin(actor);
  const data = documentSchema.parse(input);
  if (id) {
    idSchema.parse(id);
    revisionSchema.parse(revision);
  }
  return transaction(async (tx) => {
    if (!id) {
      const created = await insertDocument(tx, kind, data);
      await audit(tx, actor, `${kind.toLowerCase()}.created`, created.id);
      return created;
    }
    const existing = await readDocument(tx, kind, id);
    if (existing.status !== "DRAFT") throw new AdminError("draft_only", 409);
    if (existing.revision !== revision) throw new AdminError("conflict", 409);
    const client = clientRecord(
      required(
        (
          await tx.execute({
            sql: "SELECT * FROM clients WHERE id=?",
            args: [data.clientId],
          })
        ).rows[0],
      ),
    );
    const issuer = await readSettings(tx);
    const totals = calculateDocument(data);
    await tx.execute({
      sql: `UPDATE documents SET client_id=?,client_snapshot=?,issuer_snapshot=?,issue_date=?,due_date=?,currency=?,subtotal=?,discount=?,tax=?,total=?,notes=?,terms=?,revision=revision+1,updated_at=? WHERE id=?`,
      args: [
        data.clientId,
        JSON.stringify(client),
        JSON.stringify(issuer),
        data.issueDate,
        data.dueDate,
        data.currency,
        totals.subtotal,
        totals.discount,
        totals.tax,
        totals.total,
        data.notes,
        data.terms,
        now(),
        id,
      ],
    });
    await writeItems(tx, id, totals.items);
    await audit(tx, actor, `${kind.toLowerCase()}.updated`, id);
    return { id };
  });
}

export async function deleteDocument(
  actor: AdminActor,
  kind: DocumentKind,
  id: string,
  revision: number,
) {
  assertAdmin(actor);
  idSchema.parse(id);
  revisionSchema.parse(revision);
  await transaction(async (tx) => {
    const existing = await readDocument(tx, kind, id);
    if (existing.status !== "DRAFT") throw new AdminError("draft_only", 409);
    if (existing.revision !== revision) throw new AdminError("conflict", 409);
    await tx.execute({ sql: "DELETE FROM documents WHERE id=?", args: [id] });
    await audit(tx, actor, `${kind.toLowerCase()}.deleted`, id);
  });
}

export async function changeDocumentStatus(
  actor: AdminActor,
  kind: DocumentKind,
  id: string,
  status: string,
  revision: number,
) {
  assertAdmin(actor);
  idSchema.parse(id);
  revisionSchema.parse(revision);
  await transaction(async (tx) => {
    const doc = await readDocument(tx, kind, id);
    if (doc.revision !== revision) throw new AdminError("conflict", 409);
    const transitions: Record<string, string[]> =
      kind === "ESTIMATE"
        ? { DRAFT: ["SENT"], SENT: ["ACCEPTED", "REJECTED", "EXPIRED"] }
        : {
            DRAFT: ["SENT", "CANCELLED"],
            SENT: ["PAID", "CANCELLED"],
            PARTIALLY_PAID: ["PAID"],
            OVERDUE: doc.amountPaid === 0 ? ["PAID", "CANCELLED"] : ["PAID"],
          };
    if (!transitions[doc.status]?.includes(status))
      throw new AdminError("invalid_transition", 409);
    if (status === "SENT" && !doc.issuer.issuerName)
      throw new AdminError("issuer_required", 409);
    if (status === "EXPIRED" && doc.dueDate >= today())
      throw new AdminError("invalid_transition", 409);
    await tx.execute({
      sql: "UPDATE documents SET status=?,amount_paid=?,revision=revision+1,updated_at=? WHERE id=?",
      args: [status, status === "PAID" ? doc.total : doc.amountPaid, now(), id],
    });
    await audit(tx, actor, `${kind.toLowerCase()}.${status.toLowerCase()}`, id);
  });
}

export async function recordPayment(
  actor: AdminActor,
  id: string,
  amount: string,
  revision: number,
) {
  assertAdmin(actor);
  idSchema.parse(id);
  revisionSchema.parse(revision);
  const minor = scaled(amount);
  await transaction(async (tx) => {
    const doc = await readDocument(tx, "INVOICE", id);
    if (doc.revision !== revision) throw new AdminError("conflict", 409);
    if (!["SENT", "PARTIALLY_PAID", "OVERDUE"].includes(doc.status))
      throw new AdminError("invalid_transition", 409);
    if (minor <= BigInt(doc.amountPaid) || minor > BigInt(doc.total))
      throw new AdminError("payment_range");
    await tx.execute({
      sql: "UPDATE documents SET amount_paid=?,status=?,revision=revision+1,updated_at=? WHERE id=?",
      args: [
        Number(minor),
        Number(minor) === doc.total ? "PAID" : "PARTIALLY_PAID",
        now(),
        id,
      ],
    });
    await audit(tx, actor, "invoice.payment", id);
  });
}

export async function convertEstimate(actor: AdminActor, id: string) {
  assertAdmin(actor);
  idSchema.parse(id);
  return transaction(async (tx) => {
    const doc = await readDocument(tx, "ESTIMATE", id);
    if (doc.status !== "ACCEPTED") throw new AdminError("accepted_only", 409);
    const existing = (
      await tx.execute({
        sql: "SELECT id FROM documents WHERE source_estimate_id=?",
        args: [id],
      })
    ).rows[0];
    if (existing) return { id: String(existing.id) };
    const data: DocumentInput = {
      clientId: doc.clientId,
      issueDate: today(),
      dueDate: today(),
      currency: doc.currency,
      discount: decimalFromMinor(doc.discount),
      notes: doc.notes,
      terms: doc.terms,
      items: doc.items.map(({ description, quantity, unitPrice, taxRate }) => ({
        description,
        quantity,
        unitPrice,
        taxRate,
      })),
    };
    const invoice = await insertDocument(tx, "INVOICE", data, doc);
    await audit(tx, actor, "estimate.converted", id);
    return invoice;
  });
}
