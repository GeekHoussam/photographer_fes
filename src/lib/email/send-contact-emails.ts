import { Resend } from "resend";
import type { ContactInput } from "@/features/contact/schema";

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character] ??
      character,
  );
}

export async function sendContactEmails(input: ContactInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !from || !to) {
    if (process.env.NODE_ENV === "production")
      throw new Error("Contact email delivery is not configured");
    return { id: "development-placeholder" };
  }

  const resend = new Resend(apiKey);
  const safe = {
    name: escapeHtml(input.name),
    email: escapeHtml(input.email),
    phone: escapeHtml(input.phone || "Not provided"),
    projectType: escapeHtml(input.projectType),
    preferredDate: escapeHtml(input.preferredDate || "Not provided"),
    location: escapeHtml(input.location),
    budget: escapeHtml(input.budget || "Not provided"),
    message: escapeHtml(input.message).replace(/\n/g, "<br />"),
  };

  const business = await resend.emails.send({
    from,
    to,
    replyTo: input.email,
    subject: `New portfolio enquiry — ${input.projectType}`,
    html: `<h1>New enquiry</h1><p><strong>Name:</strong> ${safe.name}</p><p><strong>Email:</strong> ${safe.email}</p><p><strong>Phone:</strong> ${safe.phone}</p><p><strong>Project:</strong> ${safe.projectType}</p><p><strong>Date:</strong> ${safe.preferredDate}</p><p><strong>Location:</strong> ${safe.location}</p><p><strong>Budget:</strong> ${safe.budget}</p><p><strong>Message:</strong><br />${safe.message}</p>`,
  });
  if (business.error) throw new Error("Business notification failed");

  const acknowledgement = await resend.emails.send({
    from,
    to: input.email,
    subject: "Your enquiry has been received / Votre demande a été reçue",
    html: `<p>Bonjour ${safe.name},</p><p>Votre demande a bien été reçue. Une réponse personnalisée vous sera envoyée après examen.</p><hr /><p>Hello ${safe.name},</p><p>Your enquiry has been received. A personal response will be sent after review.</p>`,
  });
  if (acknowledgement.error) throw new Error("Acknowledgement failed");
  return business.data;
}
