import "server-only";
import { Resend } from "resend";
import { AdminError } from "@/features/admin/errors";

export function replyEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL);
}
export async function sendAdminReply(
  to: string,
  content: string,
  requestId: string,
) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !from) throw new AdminError("email_unconfigured", 503);
  const response = await new Resend(key).emails.send(
    {
      from,
      to,
      subject: "Your enquiry / Votre demande / طلبكم",
      text: content,
    },
    { idempotencyKey: `admin-reply/${requestId}` },
  );
  if (response.error || !response.data?.id)
    throw new AdminError("email_failed", 502);
  return response.data.id;
}
