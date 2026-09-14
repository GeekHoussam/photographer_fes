import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import {
  ContactRequestError,
  readContactJson,
  validateContactRequest,
} from "@/features/contact/request-policy";
import { AdminError } from "../errors";
import { decimal, documentSchema, localeSchema } from "../schema";
import {
  assertAdmin,
  login,
  logout,
  SESSION_COOKIE,
  SESSION_SECONDS,
  sessionActor,
} from "./auth";
import { deleteClient, getClient, listClients, saveClient } from "./clients";
import {
  changeDocumentStatus,
  convertEstimate,
  deleteDocument,
  getDocument,
  listDocuments,
  recordPayment,
  saveDocument,
} from "./documents";
import {
  getMessage,
  listMessages,
  replyToMessage,
  updateMessage,
} from "./messages";
import {
  listNotifications,
  markNotificationRead,
  unreadNotifications,
} from "./notifications";
import { getOverview } from "./overview";
import { getSettings, saveSettings } from "./settings";
import { writeStatement } from "./database";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};
const revision = z.number().int().positive();
function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
      Vary: "Cookie",
    },
  });
}

export async function handleAdminRequest(request: NextRequest, path: string[]) {
  try {
    const method = request.method;
    const isMutation = method !== "GET";
    const route = path.join("/");
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const publicOperation =
      (route === "auth/login" && method === "POST") ||
      (route === "auth/logout" && method === "POST") ||
      (route === "preferences" && method === "PATCH");
    if (isMutation) validateContactRequest(request);
    const actor = route === "auth/login" ? null : await sessionActor(token);
    if (!publicOperation) assertAdmin(actor);
    let input: unknown;
    if (isMutation) {
      input = await readContactJson(request);
    }
    if (route === "auth/login" && method === "POST") {
      const session = await login(input, request.headers);
      // Rotation invalidates an existing cookie before issuing another session.
      await logout(token);
      const response = json({ ok: true });
      response.cookies.set(SESSION_COOKIE, session.token, {
        ...cookieOptions,
        maxAge: SESSION_SECONDS,
      });
      response.cookies.set("NEXT_LOCALE", session.locale, {
        path: "/",
        sameSite: "lax",
        maxAge: 365 * 24 * 60 * 60,
        secure: cookieOptions.secure,
      });
      return response;
    }
    if (route === "auth/logout" && method === "POST") {
      await logout(token);
      const response = json({ ok: true });
      response.cookies.set(SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
      return response;
    }
    if (route === "preferences" && method === "PATCH") {
      const { locale } = localeSchema.parse(input);
      if (actor?.role === "ADMIN")
        await writeStatement({
          sql: "UPDATE admin_users SET locale=? WHERE id=?",
          args: [locale, actor.id],
        });
      const response = json({ ok: true });
      response.cookies.set("NEXT_LOCALE", locale, {
        path: "/",
        sameSite: "lax",
        maxAge: 365 * 24 * 60 * 60,
        secure: cookieOptions.secure,
      });
      return response;
    }
    assertAdmin(actor);
    const [resource, id, action] = path;
    if (path.length > 3) throw new AdminError("not_found", 404);
    const query = Object.fromEntries(request.nextUrl.searchParams);
    if (resource === "overview" && path.length === 1 && method === "GET")
      return json(await getOverview(actor));
    if (resource === "settings" && path.length === 1) {
      if (method === "GET") return json(await getSettings(actor));
      if (method === "PATCH") {
        await saveSettings(actor, input);
        return json({ ok: true });
      }
    }
    if (resource === "clients" && !action) {
      if (method === "GET")
        return json(
          id ? await getClient(actor, id) : await listClients(actor, query),
        );
      if (method === "POST" && !id)
        return json(await saveClient(actor, input), 201);
      if (method === "PATCH" && id)
        return json(await saveClient(actor, input, id));
      if (method === "DELETE" && id) {
        await deleteClient(actor, id);
        return json({ ok: true });
      }
    }
    if (resource === "estimates" || resource === "invoices") {
      const kind = resource === "estimates" ? "ESTIMATE" : "INVOICE";
      if (method === "GET" && !action)
        return json(
          id
            ? await getDocument(actor, kind, id)
            : await listDocuments(actor, kind, query),
        );
      if (method === "POST" && !id)
        return json(await saveDocument(actor, kind, input), 201);
      if (id && !action && method === "PATCH") {
        const data = z
          .object({ document: documentSchema, revision })
          .strict()
          .parse(input);
        return json(
          await saveDocument(actor, kind, data.document, id, data.revision),
        );
      }
      if (id && !action && method === "DELETE") {
        await deleteDocument(
          actor,
          kind,
          id,
          z.object({ revision }).strict().parse(input).revision,
        );
        return json({ ok: true });
      }
      if (id && action === "status" && method === "PATCH") {
        const data = z
          .object({ status: z.string().max(30), revision })
          .strict()
          .parse(input);
        await changeDocumentStatus(actor, kind, id, data.status, data.revision);
        return json({ ok: true });
      }
      if (
        id &&
        action === "payment" &&
        kind === "INVOICE" &&
        method === "POST"
      ) {
        const data = z
          .object({ amountPaid: decimal, revision })
          .strict()
          .parse(input);
        await recordPayment(actor, id, data.amountPaid, data.revision);
        return json({ ok: true });
      }
      if (
        id &&
        action === "convert" &&
        kind === "ESTIMATE" &&
        method === "POST"
      )
        return json(await convertEstimate(actor, id), 201);
    }
    if (resource === "messages") {
      if (method === "GET" && !action)
        return json(
          id ? await getMessage(actor, id) : await listMessages(actor, query),
        );
      if (id && method === "PATCH" && !action) {
        const data = z
          .object({
            isRead: z.boolean().optional(),
            status: z.literal("ARCHIVED").optional(),
          })
          .strict()
          .refine((v) => v.isRead !== undefined || v.status !== undefined)
          .parse(input);
        await updateMessage(actor, id, data);
        return json({ ok: true });
      }
      if (id && method === "POST" && action === "reply") {
        await replyToMessage(actor, id, input);
        return json({ ok: true });
      }
    }
    if (resource === "notifications" && !action) {
      if (method === "GET" && !id)
        return json(await listNotifications(actor, query));
      if (method === "GET" && id === "count")
        return json({ count: await unreadNotifications(actor) });
      if (method === "PATCH") {
        await markNotificationRead(actor, id === "all" ? undefined : id);
        return json({ ok: true });
      }
    }
    throw new AdminError("not_found", 404);
  } catch (error) {
    if (error instanceof z.ZodError)
      return json({ ok: false, error: "validation" }, 400);
    if (error instanceof AdminError || error instanceof ContactRequestError)
      return json({ ok: false, error: error.code }, error.status);
    console.warn("Admin request failed", { method: request.method });
    return json({ ok: false, error: "unavailable" }, 503);
  }
}
