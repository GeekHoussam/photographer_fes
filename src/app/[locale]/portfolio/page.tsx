import { Suspense } from "react";
import { Container } from "@/components/common/container";
import { PortfolioFilters } from "@/components/portfolio/portfolio-filters";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { isLocale } from "@/config/site";
import { getPageContent } from "@/features/content/pages";
import { createPageMetadata } from "@/lib/seo/metadata";
import { portfolioPageJsonLd } from "@/lib/seo/structured-data";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = getPageContent("portfolio", locale);
  return createPageMetadata({
    locale,
    path: content.path,
    title: content.metaTitle,
    description: content.metaDescription,
  });
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const content = getPageContent("portfolio", locale);
  const loading = {
    fr: "Chargement des filtres…",
    en: "Loading filters…",
    ar: "جارٍ تحميل عوامل التصفية…",
  }[locale];
  return (
    <>
      <JsonLd data={portfolioPageJsonLd(locale)} />
      <PageHero
        eyebrow={content.eyebrow}
        title={content.h1}
        introduction={content.introduction}
      />
      <section className="section-space bg-ink text-paper">
        <Container>
          <Suspense fallback={<p className="text-muted">{loading}</p>}>
            <PortfolioFilters />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
