// @vitest-environment node
import {
  beforeAll,
  afterAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { readFile } from "node:fs/promises";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { closeDatabase, getDatabase } from "@/features/admin/server/database";
import { hashPassword } from "@/features/admin/server/password";
import {
  login,
  logout,
  sessionActor,
  type AdminActor,
} from "@/features/admin/server/auth";
import {
  saveClient,
  deleteClient,
  listClients,
  getClient,
} from "@/features/admin/server/clients";
import {
  saveDocument,
  getDocument,
  deleteDocument,
  changeDocumentStatus,
  recordPayment,
  convertEstimate,
} from "@/features/admin/server/documents";
import { getOverview } from "@/features/admin/server/overview";
import {
  persistContactMessage,
  getMessage,
  getReplies,
  listMessages,
  updateMessage,
  replyToMessage,
} from "@/features/admin/server/messages";
import {
  unreadNotifications,
  markNotificationRead,
  listNotifications,
} from "@/features/admin/server/notifications";
import { handleAdminRequest } from "@/features/admin/server/api";
import { sendAdminReply } from "@/lib/email/send-admin-reply";
import type { DocumentInput } from "@/features/admin/schema";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/email/send-admin-reply", () => ({ sendAdminReply: vi.fn() }));
const testDatabaseUrl = process.env.TEST_DATABASE_URL;
if (process.env.CI && !testDatabaseUrl)
  throw new Error("TEST_DATABASE_URL is required in CI");
const postgresSuite = testDatabaseUrl ? describe : describe.skip;
let passwordHash: string;
let adminToken: string;
let userToken: string;
let clientId: string;
const actor: AdminActor = {
  id: randomUUID(),
  name: "Test Admin",
  email: "admin@example.test",
  role: "ADMIN",
  locale: "en",
};
const user: AdminActor = {
  ...actor,
  id: randomUUID(),
  role: "USER",
  email: "user@example.test",
};
const password = "Only-a-test-password-7391";
const client = {
  name: "Test Client",
  companyName: "",
  email: "client@example.test",
  phone: "",
  address: "",
  city: "Fez",
  country: "",
  notes: "",
};
const contact = {
  name: "Test Visitor",
  email: "client@example.test",
  projectType: "portrait" as const,
  location: "Fez",
  message: "A sufficiently detailed enquiry about a portrait session.",
  consent: true,
  website: "",
};
const input = (): DocumentInput => ({
  clientId,
  issueDate: "2026-01-01",
  dueDate: "2099-01-01",
  currency: "MAD",
  discount: "10",
  notes: "",
  terms: "",
  items: [
    {
      description: "Photography",
      quantity: "2",
      unitPrice: "100.25",
      taxRate: "20",
    },
  ],
});
async function newInvoice() {
  return (await saveDocument(actor, "INVOICE", input())).id;
}
async function sentInvoice() {
  const id = await newInvoice();
  await changeDocumentStatus(actor, "INVOICE", id, "SENT", 1);
  return id;
}
const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex");
function req(
  path: string,
  method = "GET",
  body: unknown = {},
  token?: string,
  origin = "https://admin.example",
) {
  return new NextRequest(`https://admin.example/api/admin/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
      ...(token ? { Cookie: `admin-session=${token}` } : {}),
    },
    body: method === "GET" ? undefined : JSON.stringify(body),
  });
}
async function api(
  path: string,
  method = "GET",
  body: unknown = {},
  token?: string,
  origin?: string,
) {
  return handleAdminRequest(
    req(path, method, body, token, origin),
    path.split("/"),
  );
}
beforeAll(async () => {
  if (!testDatabaseUrl) return;
  vi.stubEnv("ADMIN_DATABASE_URL", testDatabaseUrl);
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://admin.example");
  vi.stubEnv("CONTACT_RATE_LIMIT_IP_HEADER", "");
  const sql = await readFile("db/migrations/001_admin.sql", "utf8");
  await getDatabase().withTransaction(async (tx) => {
    await tx.executeScript("DROP SCHEMA public CASCADE; CREATE SCHEMA public");
    await tx.executeScript(sql);
  });
  passwordHash = await hashPassword(password);
});
beforeEach(async () => {
  if (!testDatabaseUrl) return;
  vi.clearAllMocks();
  vi.mocked(sendAdminReply).mockResolvedValue("provider-test-id");
  const db = getDatabase();
  await db.batch(
    [
      "DELETE FROM admin_audit",
      "DELETE FROM message_replies",
      "DELETE FROM notifications",
      "DELETE FROM contact_messages",
      "DELETE FROM document_items",
      "UPDATE documents SET source_estimate_id=NULL",
      "DELETE FROM documents",
      "DELETE FROM document_sequences",
      "DELETE FROM clients",
      "DELETE FROM admin_sessions",
      "DELETE FROM admin_users",
      "DELETE FROM admin_rate_limits",
      "UPDATE admin_settings SET issuer_name='Test Studio'",
    ],
    "write",
  );
  for (const who of [actor, user])
    await db.execute({
      sql: "INSERT INTO admin_users(id,email,name,password_hash,role,locale,created_at,updated_at) VALUES (?,?,?,?,?,'en',?,?)",
      args: [
        who.id,
        who.email,
        who.name,
        passwordHash,
        who.role,
        new Date().toISOString(),
        new Date().toISOString(),
      ],
    });
  adminToken = randomBytes(32).toString("base64url");
  userToken = randomBytes(32).toString("base64url");
  for (const [token, who] of [
    [adminToken, actor],
    [userToken, user],
  ] as const)
    await db.execute({
      sql: "INSERT INTO admin_sessions(token_hash,user_id,expires_at,created_at) VALUES (?,?,?,?)",
      args: [
        digest(token),
        who.id,
        Date.now() + 3600000,
        new Date().toISOString(),
      ],
    });
  clientId = (await saveClient(actor, client)).id;
});
afterAll(async () => {
  if (!testDatabaseUrl) return;
  await closeDatabase();
  vi.unstubAllEnvs();
});

postgresSuite("admin authentication and API boundaries", () => {
  it("authenticates an administrator with a hashed, expiring session", async () => {
    const session = await login(
      { email: actor.email, password },
      new Headers(),
    );
    expect((await sessionActor(session.token))?.id).toBe(actor.id);
    await logout(session.token);
    expect(await sessionActor(session.token)).toBeNull();
  });
  it("rejects bad passwords and non-admin users", async () => {
    await expect(
      login({ email: actor.email, password: "wrong" }, new Headers()),
    ).rejects.toThrow("invalid_credentials");
    await expect(
      login({ email: user.email, password }, new Headers()),
    ).rejects.toThrow("invalid_credentials");
  });
  it("revokes access immediately for disabled, demoted or expired sessions", async () => {
    await getDatabase().execute({
      sql: "UPDATE admin_users SET role='USER' WHERE id=?",
      args: [actor.id],
    });
    expect((await api("clients", "GET", {}, adminToken)).status).toBe(403);
    await getDatabase().execute({
      sql: "UPDATE admin_users SET active=FALSE WHERE id=?",
      args: [actor.id],
    });
    expect(await sessionActor(adminToken)).toBeNull();
    await getDatabase().execute("UPDATE admin_sessions SET expires_at=1");
    expect(await sessionActor(userToken)).toBeNull();
  });
  it("enforces persistent account and IP login quotas", async () => {
    await getDatabase().execute({
      sql: "INSERT INTO admin_rate_limits(key,attempts,reset_at) VALUES (?,10,?)",
      args: ["login:ip:local", Date.now() + 60000],
    });
    await expect(
      login({ email: actor.email, password }, new Headers()),
    ).rejects.toThrow("rate_limited");
  });
  it.each([
    "clients",
    "estimates",
    "invoices",
    "messages",
    "notifications",
    "settings",
    "overview",
  ])("denies anonymous and USER reads for %s", async (path) => {
    expect((await api(path)).status).toBe(401);
    expect((await api(path, "GET", {}, userToken)).status).toBe(403);
    expect((await api(path, "GET", {}, adminToken)).status).toBe(200);
  });
  it.each([
    "clients",
    "estimates",
    "invoices",
    `messages/${randomUUID()}/reply`,
    `notifications/all`,
    "settings",
  ])("denies unauthorized mutations for %s", async (path) => {
    expect((await api(path, "POST", {}, userToken)).status).toBe(403);
    expect((await api(path, "POST")).status).toBe(401);
  });
  it("blocks cross-origin mutation and caches no private response", async () => {
    expect(
      (
        await api(
          "clients",
          "POST",
          client,
          adminToken,
          "https://attacker.example",
        )
      ).status,
    ).toBe(403);
    const response = await api("clients", "GET", {}, adminToken);
    expect(response.headers.get("cache-control")).toContain("no-store");
  });
  it("rejects mass assignment, malformed IDs and SQL-like search safely", async () => {
    expect(
      (await api("clients", "POST", { ...client, role: "ADMIN" }, adminToken))
        .status,
    ).toBe(400);
    expect((await api("clients/not-an-id", "GET", {}, adminToken)).status).toBe(
      400,
    );
    expect((await listClients(actor, { q: "' OR 1=1 --" })).total).toBe(0);
  });
});
postgresSuite("clients and financial records", () => {
  it("creates, updates and deletes clients without related records", async () => {
    await saveClient(actor, { ...client, name: "Updated Client" }, clientId);
    expect((await getClient(actor, clientId)).name).toBe("Updated Client");
    await deleteClient(actor, clientId);
    expect((await listClients(actor)).total).toBe(0);
  });
  it("protects clients with documents and database foreign keys", async () => {
    await newInvoice();
    await expect(deleteClient(actor, clientId)).rejects.toThrow(
      "client_has_documents",
    );
    await expect(
      getDatabase().execute({
        sql: "DELETE FROM clients WHERE id=?",
        args: [clientId],
      }),
    ).rejects.toThrow();
  });
  it("calculates totals server-side, updates drafts and rejects stale revisions", async () => {
    const id = await newInvoice();
    expect((await getDocument(actor, "INVOICE", id)).total).toBe(22860);
    await saveDocument(actor, "INVOICE", { ...input(), discount: "0" }, id, 1);
    expect((await getDocument(actor, "INVOICE", id)).total).toBe(24060);
    await expect(
      saveDocument(actor, "INVOICE", input(), id, 1),
    ).rejects.toThrow("conflict");
  });
  it("does not reuse change the year of an existing document number", async () => {
    const id = await newInvoice();
    const before = await getDocument(actor, "INVOICE", id);
    await saveDocument(
      actor,
      "INVOICE",
      { ...input(), notes: "Changed" },
      id,
      1,
    );
    expect((await getDocument(actor, "INVOICE", id)).number).toBe(
      before.number,
    );
  });
  it("generates unique numbers and never reuses deleted numbers", async () => {
    const first = await newInvoice();
    const number = (await getDocument(actor, "INVOICE", first)).number;
    await deleteDocument(actor, "INVOICE", first, 1);
    const second = await newInvoice();
    expect((await getDocument(actor, "INVOICE", second)).number).not.toBe(
      number,
    );
    const results = await Promise.all([
      newInvoice(),
      newInvoice(),
      newInvoice(),
    ]);
    const numbers = await Promise.all(
      results.map(
        async (id) => (await getDocument(actor, "INVOICE", id)).number,
      ),
    );
    expect(new Set(numbers).size).toBe(3);
  });
  it("locks issued records and retains client snapshots", async () => {
    const id = await sentInvoice();
    await saveClient(actor, { ...client, name: "Changed Name" }, clientId);
    expect((await getDocument(actor, "INVOICE", id)).client.name).toBe(
      "Test Client",
    );
    await expect(
      saveDocument(actor, "INVOICE", input(), id, 2),
    ).rejects.toThrow("draft_only");
    await expect(deleteDocument(actor, "INVOICE", id, 2)).rejects.toThrow(
      "draft_only",
    );
  });
  it("tracks partial and full payment, rejecting overpayment and stale updates", async () => {
    const id = await sentInvoice();
    await recordPayment(actor, id, "100", 2);
    expect((await getDocument(actor, "INVOICE", id)).status).toBe(
      "PARTIALLY_PAID",
    );
    await expect(recordPayment(actor, id, "9999", 3)).rejects.toThrow(
      "payment_range",
    );
    await expect(
      changeDocumentStatus(actor, "INVOICE", id, "CANCELLED", 3),
    ).rejects.toThrow("invalid_transition");
    await changeDocumentStatus(actor, "INVOICE", id, "PAID", 3);
    const doc = await getDocument(actor, "INVOICE", id);
    expect(doc.amountPaid).toBe(doc.total);
    await expect(
      changeDocumentStatus(actor, "INVOICE", id, "PAID", 3),
    ).rejects.toThrow("conflict");
  });
  it("converts an accepted estimate once and preserves the original", async () => {
    const { id } = await saveDocument(actor, "ESTIMATE", input());
    await expect(convertEstimate(actor, id)).rejects.toThrow("accepted_only");
    await changeDocumentStatus(actor, "ESTIMATE", id, "SENT", 1);
    await changeDocumentStatus(actor, "ESTIMATE", id, "ACCEPTED", 2);
    const invoice = await convertEstimate(actor, id);
    expect(await convertEstimate(actor, id)).toEqual(invoice);
    expect((await getDocument(actor, "ESTIMATE", id)).status).toBe("ACCEPTED");
    expect(
      (await getDocument(actor, "INVOICE", invoice.id)).sourceEstimateId,
    ).toBe(id);
  });
});
postgresSuite("persisted enquiries, notifications and replies", () => {
  it("persists the complete contact form and an unread notification atomically", async () => {
    const id = await persistContactMessage(contact);
    expect((await listMessages(actor)).items[0].id).toBe(id);
    expect((await getMessage(actor, id)).message).toBe(contact.message);
    expect(await unreadNotifications(actor)).toBe(1);
    expect((await getOverview(actor)).counts.unreadMessages).toBe(1);
  });
  it("synchronizes message read/unread and archive with notification counts", async () => {
    const id = await persistContactMessage(contact);
    await updateMessage(actor, id, { isRead: true });
    expect(await unreadNotifications(actor)).toBe(0);
    await updateMessage(actor, id, { isRead: false });
    expect(await unreadNotifications(actor)).toBe(1);
    await updateMessage(actor, id, { status: "ARCHIVED" });
    expect((await getMessage(actor, id)).status).toBe("ARCHIVED");
    expect(await unreadNotifications(actor)).toBe(0);
  });
  it("supports marking one or all notifications read", async () => {
    await persistContactMessage(contact);
    await persistContactMessage(contact);
    const notifications = await listNotifications(actor);
    await markNotificationRead(actor, notifications.items[0].id);
    expect(await unreadNotifications(actor)).toBe(1);
    await markNotificationRead(actor);
    expect(await unreadNotifications(actor)).toBe(0);
  });
  it("persists successful replies and does not resend the same request", async () => {
    const id = await persistContactMessage(contact);
    const data = {
      requestId: randomUUID(),
      content: "Thank you for your enquiry.",
    };
    await replyToMessage(actor, id, data);
    await replyToMessage(actor, id, data);
    expect(sendAdminReply).toHaveBeenCalledTimes(1);
    expect((await getMessage(actor, id)).status).toBe("REPLIED");
    expect((await getReplies(actor, id))[0].status).toBe("SENT");
    expect(await unreadNotifications(actor)).toBe(0);
  });
  it("never marks failed emails as replied and supports retry", async () => {
    const id = await persistContactMessage(contact);
    const data = {
      requestId: randomUUID(),
      content: "Thank you for your enquiry.",
    };
    vi.mocked(sendAdminReply).mockRejectedValueOnce(
      new Error("provider failed"),
    );
    await expect(replyToMessage(actor, id, data)).rejects.toThrow(
      "email_failed",
    );
    expect((await getMessage(actor, id)).status).toBe("NEW");
    expect((await getReplies(actor, id))[0].status).toBe("FAILED");
    await replyToMessage(actor, id, data);
    expect((await getMessage(actor, id)).status).toBe("REPLIED");
  });
  it("cannot forge REPLIED or reuse another message's reply request", async () => {
    const first = await persistContactMessage(contact);
    const second = await persistContactMessage(contact);
    const data = { requestId: randomUUID(), content: "Reply" };
    await replyToMessage(actor, first, data);
    await expect(replyToMessage(actor, second, data)).rejects.toThrow(
      "conflict",
    );
    expect(
      (
        await api(
          `messages/${second}`,
          "PATCH",
          { status: "REPLIED" },
          adminToken,
        )
      ).status,
    ).toBe(400);
  });
});
