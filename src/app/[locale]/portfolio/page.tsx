import { Suspense } from "react";
import { Container } from "@/components/common/container";
import { PortfolioFilters } from "@/components/portfolio/portfolio-filters";
import { PageHero } from "@/components/sections/page-hero";
import { isLocale } from "@/config/site";

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
