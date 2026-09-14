import "server-only";
import { randomUUID } from "node:crypto";
import { AdminError } from "../errors";
import { clientSchema, idSchema, querySchema, type ListQuery } from "../schema";
import { assertAdmin, type AdminActor } from "./auth";
import { getDatabase, transaction } from "./database";
import { audit, clientRecord, now, required } from "./records";

export async function listClients(
  actor: AdminActor,
  input: Partial<ListQuery> = {},
) {
  assertAdmin(actor);
  const { q, page } = querySchema.parse(input);
  const where =
    "WHERE position(lower(?) IN lower(name || ' ' || email || ' ' || company_name)) > 0";
  const results = await getDatabase().batch(
    [
      {
        sql: `SELECT * FROM clients ${where} ORDER BY created_at DESC LIMIT 20 OFFSET ?`,
        args: [q, (page - 1) * 20],
      },
      { sql: `SELECT count(*) AS total FROM clients ${where}`, args: [q] },
    ],
    "read",
  );
  return {
    items: results[0].rows.map(clientRecord),
    total: Number(results[1].rows[0].total),
    page,
    pageSize: 20,
  };
}
export async function getClient(actor: AdminActor, id: string) {
  assertAdmin(actor);
  idSchema.parse(id);
  return clientRecord(
    required(
      (
        await getDatabase().execute({
          sql: "SELECT * FROM clients WHERE id = ?",
          args: [id],
        })
      ).rows[0],
    ),
  );
}
export async function saveClient(
  actor: AdminActor,
  input: unknown,
  id?: string,
) {
  assertAdmin(actor);
  const data = clientSchema.parse(input);
  if (id) idSchema.parse(id);
  const clientId = id ?? randomUUID();
  await transaction(async (tx) => {
    const values = [
      data.name,
      data.companyName,
      data.email,
      data.phone,
      data.address,
      data.city,
      data.country,
      data.notes,
      now(),
    ];
    if (id) {
      const result = await tx.execute({
        sql: "UPDATE clients SET name=?,company_name=?,email=?,phone=?,address=?,city=?,country=?,notes=?,updated_at=? WHERE id=?",
        args: [...values, id],
      });
      if (!result.rowsAffected) throw new AdminError("not_found", 404);
    } else {
      await tx.execute({
        sql: "INSERT INTO clients(name,company_name,email,phone,address,city,country,notes,updated_at,id,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        args: [...values, clientId, now()],
      });
    }
    await audit(tx, actor, id ? "client.updated" : "client.created", clientId);
  });
  return { id: clientId };
}
export async function deleteClient(actor: AdminActor, id: string) {
  assertAdmin(actor);
  idSchema.parse(id);
  await transaction(async (tx) => {
    if (
      (
        await tx.execute({
          sql: "SELECT id FROM documents WHERE client_id = ? LIMIT 1",
          args: [id],
        })
      ).rows.length
    )
      throw new AdminError("client_has_documents", 409);
    const result = await tx.execute({
      sql: "DELETE FROM clients WHERE id = ?",
      args: [id],
    });
    if (!result.rowsAffected) throw new AdminError("not_found", 404);
    await audit(tx, actor, "client.deleted", id);
  });
}
