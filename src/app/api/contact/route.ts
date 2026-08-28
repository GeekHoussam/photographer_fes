import { NextResponse } from "next/server";
import { contactSchema } from "@/features/contact/schema";
import {
  checkContactRateLimit,
  getContactRateLimitKey,
} from "@/features/contact/rate-limit";
import {
  ContactRequestError,
  readContactJson,
  validateContactRequest,
} from "@/features/contact/request-policy";
import { sendContactEmails } from "@/lib/email/send-contact-emails";

export const runtime = "nodejs";

function json(body: object, status = 200, headers = {}) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

export async function POST(request: Request) {
  try {
    validateContactRequest(request);
    const key = getContactRateLimitKey(request.headers);
    if (!(await checkContactRateLimit(key))) {
      return json({ ok: false, error: "rate_limited" }, 429, {
        "Retry-After": "900",
      });
    }
  } catch (error) {
    if (error instanceof ContactRequestError) {
      return json({ ok: false, error: error.code }, error.status);
    }
    return json({ ok: false, error: "unavailable" }, 503);
  }

  let body: unknown;
  try {
    body = await readContactJson(request);
  } catch (error) {
    if (error instanceof ContactRequestError) {
      return json({ ok: false, error: error.code }, error.status);
    }
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        error: "validation",
        fields: parsed.error.flatten().fieldErrors,
      },
      400,
    );
  }

  try {
    await sendContactEmails(parsed.data);
    return json({ ok: true });
  } catch {
    return json({ ok: false, error: "delivery" }, 503);
  }
}
