import { NextResponse } from "next/server";
import { contactSchema } from "@/features/contact/schema";
import { checkContactRateLimit } from "@/features/contact/rate-limit";
import { sendContactEmails } from "@/lib/email/send-contact-emails";

export async function POST(request: Request) {
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const key = forwarded || "local";
  if (!(await checkContactRateLimit(key))) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "validation",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    await sendContactEmails(parsed.data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "delivery" }, { status: 503 });
  }
}
