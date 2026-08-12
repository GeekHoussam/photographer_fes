import { ButtonLink } from "@/components/common/button";
import { Container } from "@/components/common/container";
import { createPageMetadata } from "@/lib/seo/metadata";
import { isLocale } from "@/config/site";
import { getPageContent } from "@/features/content/pages";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = getPageContent("thankYou", locale);
  return createPageMetadata({
    locale,
    path: content.path,
    title: content.metaTitle,
    description: content.metaDescription,
    noIndex: !content.indexable,
  });
}

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const fr = locale === "fr";
  const content = getPageContent("thankYou", locale);
  return (
    <section className="bg-ink text-paper flex min-h-[75vh] items-center pt-20">
      <Container>
        <p className="eyebrow text-sand">
          {fr ? "Message envoyé" : "Message sent"}
        </p>
        <h1 className="font-display mt-6 max-w-4xl text-7xl leading-[0.9]">
          {content.h1}
        </h1>
        <p className="mt-7 max-w-xl text-base leading-8 text-white/55">
          {content.introduction}
        </p>
        <ButtonLink href="/portfolio" className="bg-paper text-ink mt-10">
          {fr
            ? "Voir les séries photographiques"
            : "View the photography series"}
        </ButtonLink>
      </Container>
    </section>
  );
}
