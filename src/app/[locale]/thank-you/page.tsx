import { ButtonLink } from "@/components/common/button";
import { Container } from "@/components/common/container";
import { createPageMetadata } from "@/lib/seo/metadata";
import { isLocale } from "@/config/site";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return createPageMetadata({
    locale,
    path: "/thank-you",
    title: locale === "fr" ? "Message reçu" : "Message received",
    description:
      locale === "fr"
        ? "Confirmation de réception de votre demande."
        : "Confirmation that your enquiry has been received.",
    noIndex: true,
  });
}

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const fr = locale === "fr";
  return (
    <section className="bg-ink text-paper flex min-h-[75vh] items-center pt-20">
      <Container>
        <p className="eyebrow text-sand">
          {fr ? "Message envoyé" : "Message sent"}
        </p>
        <h1 className="font-display mt-6 max-w-4xl text-7xl leading-[0.9]">
          {fr
            ? "Merci. Votre projet est entre de bonnes mains."
            : "Thank you. Your project is in good hands."}
        </h1>
        <ButtonLink href="/portfolio" className="bg-paper text-ink mt-10">
          {fr ? "Voir le portfolio" : "View portfolio"}
        </ButtonLink>
      </Container>
    </section>
  );
}
