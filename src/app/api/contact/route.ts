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
import {
  persistContactMessage,
  setContactEmailStatus,
} from "@/features/admin/server/messages";

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

  let messageId: string;
  try {
    messageId = await persistContactMessage(parsed.data);
  } catch {
    return json({ ok: false, error: "unavailable" }, 503);
  }

  let emailStatus: "SENT" | "FAILED" | "UNCONFIGURED" = "UNCONFIGURED";
  if (
    process.env.RESEND_API_KEY &&
    process.env.CONTACT_FROM_EMAIL &&
    process.env.CONTACT_TO_EMAIL
  ) {
    try {
      await sendContactEmails(parsed.data);
      emailStatus = "SENT";
    } catch {
      emailStatus = "FAILED";
      console.warn(
        "Contact email notification failed; enquiry retained in inbox",
      );
    }
  }
  try {
    await setContactEmailStatus(messageId, emailStatus);
  } catch {
    console.warn("Contact email status update failed");
  }
  // A committed enquiry is accepted even when its optional email notification
  // fails. Retrying would create duplicate enquiries without improving delivery.
  return json({ ok: true });
}
