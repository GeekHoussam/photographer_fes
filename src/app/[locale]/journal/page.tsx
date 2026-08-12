import { ResponsiveMedia } from "@/components/common/responsive-media";
import { Container } from "@/components/common/container";
import { PageHero } from "@/components/sections/page-hero";
import { Link } from "@/i18n/navigation";
import { isLocale } from "@/config/site";
import { getPageContent } from "@/features/content/pages";
import { createPageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = getPageContent("journal", locale);
  return createPageMetadata({
    locale,
    path: content.path,
    title: content.metaTitle,
    description: content.metaDescription,
    noIndex: !content.indexable,
  });
}

export default async function JournalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const fr = locale === "fr";
  const content = getPageContent("journal", locale);
  return (
    <>
      <PageHero
        eyebrow={content.eyebrow}
        title={content.h1}
        introduction={content.introduction}
        mediaSrc="/images/portfolio/food/DSC02504.webp"
      />
      <section className="section-space bg-ink text-paper">
        <Container>
          <div className="grid grid-cols-12 gap-y-8 border-y border-white/12 py-8 sm:py-12 lg:gap-x-10">
            <ResponsiveMedia
              src="/images/portfolio/interiors/DSC02171.webp"
              alt={
                fr
                  ? "Cour intérieure en zellige à Fès"
                  : "Zellige-lined courtyard in Fès"
              }
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="col-span-12 aspect-[4/3] lg:col-span-6"
            />
            <div className="col-span-12 flex flex-col justify-between lg:col-span-5 lg:col-start-8 lg:py-6">
              <div>
                <p className="eyebrow text-sand">
                  {fr ? "Carnets en préparation" : "Field notes in progress"}
                </p>
                <h2 className="font-display mt-7 text-[clamp(3rem,5vw,5.5rem)] leading-[0.87] tracking-[-0.04em]">
                  {fr ? "Aucun article publié." : "No published articles."}
                </h2>
              </div>
              <p className="mt-8 text-sm leading-7 text-white/45">
                {fr
                  ? "Le portfolio contient déjà quatre séries photographiques documentées."
                  : "The portfolio already contains four documented photographic series."}
              </p>
              <Link href="/portfolio" className="text-link-arrow mt-8 w-fit">
                {fr
                  ? "Voir les séries photographiques"
                  : "View the photography series"}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
