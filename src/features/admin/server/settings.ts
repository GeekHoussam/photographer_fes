import "server-only";
import type { Transaction } from "./database";
import { settingsSchema, type SettingsInput } from "../schema";
import { assertAdmin, type AdminActor } from "./auth";
import { getDatabase, transaction } from "./database";
import { audit, required } from "./records";

export async function readSettings(
  db: Pick<Transaction, "execute"> = getDatabase(),
): Promise<SettingsInput> {
  const r = required(
    (await db.execute("SELECT * FROM admin_settings WHERE id=1")).rows[0],
  );
  return settingsSchema.parse({
    currency: r.currency,
    issuerName: r.issuer_name,
    issuerAddress: r.issuer_address,
    issuerEmail: r.issuer_email,
    issuerRegistration: r.issuer_registration,
  });
}
export async function getSettings(actor: AdminActor) {
  assertAdmin(actor);
  return readSettings();
}
export async function saveSettings(actor: AdminActor, input: unknown) {
  assertAdmin(actor);
  const s = settingsSchema.parse(input);
  await transaction(async (tx) => {
    await tx.execute({
      sql: "UPDATE admin_settings SET currency=?,issuer_name=?,issuer_address=?,issuer_email=?,issuer_registration=? WHERE id=1",
      args: [
        s.currency,
        s.issuerName,
        s.issuerAddress,
        s.issuerEmail,
        s.issuerRegistration,
      ],
    });
    await audit(tx, actor, "settings.updated", "1");
  });
}
