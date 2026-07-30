import { ResponsiveMedia } from "@/components/common/responsive-media";
import { Container } from "@/components/common/container";
import { PageHero } from "@/components/sections/page-hero";
import { Link } from "@/i18n/navigation";
import { isLocale } from "@/config/site";

export default async function JournalPage({
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
        eyebrow="Journal"
        title={
          fr ? "Histoires, lieux et lumière." : "Stories, places, and light."
        }
        introduction={
          fr
            ? "Des notes de terrain sur les personnes, les lieux et les gestes qui façonnent une image."
            : "Field notes on the people, places, and gestures that shape an image."
        }
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
                  {fr
                    ? "Le premier récit arrive bientôt."
                    : "The first story is coming soon."}
                </h2>
              </div>
              <p className="mt-8 text-sm leading-7 text-white/45">
                {fr
                  ? "En attendant, découvrez les séries photographiques déjà publiées."
                  : "In the meantime, explore the photographic series already published."}
              </p>
              <Link href="/portfolio" className="text-link-arrow mt-8 w-fit">
                {fr ? "Voir le portfolio" : "View the portfolio"}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
