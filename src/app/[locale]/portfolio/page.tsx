import { Suspense } from "react";
import { Container } from "@/components/common/container";
import { PortfolioFilters } from "@/components/portfolio/portfolio-filters";
import { PageHero } from "@/components/sections/page-hero";
import { isLocale } from "@/config/site";
import { createPageMetadata } from "@/lib/seo/metadata";
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
    path: "/portfolio",
    title:
      locale === "fr"
        ? "Portfolio photo et vidéo"
        : "Photo and video portfolio",
    description:
      locale === "fr"
        ? "Découvrez les photographies et vidéos de Mohammed Laâchach : mariages, événements, intérieurs et gastronomie à Fès et au Maroc."
        : "Explore Mohammed Laâchach's photography and film portfolio: weddings, events, interiors, and food stories in Fès and across Morocco.",
  });
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const fr = locale === "fr";
  return (
    <>
      <PageHero
        eyebrow={fr ? "Portfolio" : "Portfolio"}
        title={
          fr
            ? "Personnes, lieux et savoir-faire."
            : "People, places, and craft."
        }
        introduction={
          fr
            ? "Quatre séries éditées pour leur rythme, leur lumière et la justesse des moments."
            : "Four series edited for rhythm, light, and the honesty of each moment."
        }
      />
      <section className="section-space bg-ink text-paper">
        <Container>
          <Suspense
            fallback={
              <p className="text-muted">
                {fr ? "Chargement des filtres…" : "Loading filters…"}
              </p>
            }
          >
            <PortfolioFilters />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
