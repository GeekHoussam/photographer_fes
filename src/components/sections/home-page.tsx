import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/config/site";
import { Container } from "@/components/common/container";
import { ResponsiveMedia } from "@/components/common/responsive-media";
import {
  portfolioProjects,
  signaturePortrait,
} from "@/features/portfolio/projects";
import { Link } from "@/i18n/navigation";
import { HomeHero } from "./home-hero";

export function HomePage({ locale }: { locale: Locale }) {
  const fr = locale === "fr";
  const selectedWork = [
    {
      image: portfolioProjects[3]!.gallery[5]!,
      className: "col-span-12 md:col-span-7",
    },
    {
      image: portfolioProjects[1]!.gallery[3]!,
      className: "col-span-8 col-start-5 md:col-span-4 md:col-start-9 md:mt-32",
    },
    {
      image: portfolioProjects[2]!.gallery[1]!,
      className: "col-span-12 md:col-span-8 md:col-start-3",
    },
    {
      image: portfolioProjects[0]!.gallery[1]!,
      className: "col-span-7 md:col-span-4",
    },
    {
      image: portfolioProjects[3]!.gallery[8]!,
      className: "col-span-5 md:col-span-6 md:col-start-7 md:mt-24",
    },
    {
      image: portfolioProjects[2]!.gallery[7]!,
      className: "col-span-12 md:col-span-9 md:col-start-2",
    },
  ];

  const process = fr
    ? [
        [
          "Écouter",
          "Comprendre le lieu, les personnes et l'usage final des images.",
        ],
        [
          "Composer",
          "Choisir une direction visuelle claire avant la prise de vue.",
        ],
        [
          "Photographier",
          "Guider avec discrétion et rester attentif à ce qui arrive.",
        ],
        [
          "Finaliser",
          "Sélectionner et affiner chaque image dans une série cohérente.",
        ],
      ]
    : [
        [
          "Listen",
          "Understand the place, the people, and how the images will be used.",
        ],
        [
          "Compose",
          "Choose a clear visual direction before production begins.",
        ],
        ["Photograph", "Guide quietly and stay attentive to what unfolds."],
        [
          "Finish",
          "Select and refine every image as part of one coherent series.",
        ],
      ];

  return (
    <>
      <HomeHero locale={locale} />

      <section className="section-space bg-ink text-paper">
        <Container>
          <div className="mb-14 max-w-4xl sm:mb-20">
            <p className="eyebrow text-sand">
              {fr ? "Séries choisies" : "Selected stories"}
            </p>
            <h2 className="display-section mt-6">
              {fr
                ? "Quatre regards, une même présence."
                : "Four views, one clear presence."}
            </h2>
          </div>

          <div className="space-y-5 md:space-y-8">
            {portfolioProjects.map((project, index) => (
              <article
                key={project.slug}
                className="group bg-ink relative overflow-hidden border border-white/12 md:sticky"
                style={{
                  top: `calc(var(--header-height) + ${index * 1.15}rem)`,
                }}
              >
                <Link href={`/portfolio/${project.slug}`} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/9] lg:aspect-[16/7]">
                    <ResponsiveMedia
                      src={project.cover.src}
                      alt={project.cover.alt[locale]}
                      sizes="100vw"
                      className="h-full w-full rounded-none"
                      imageClassName="transition-transform duration-1000 ease-[var(--ease-out)] group-hover:scale-[1.025]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/25" />
                    <div className="absolute inset-x-0 bottom-0 grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:items-end sm:p-8 lg:p-12">
                      <div>
                        <p className="text-sand text-xs font-bold tracking-[0.14em] uppercase">
                          {String(index + 1).padStart(2, "0")} /{" "}
                          {project.categoryLabel[locale]}
                        </p>
                        <h3 className="font-display mt-3 text-[clamp(3rem,7vw,7rem)] leading-[0.84] tracking-[-0.045em]">
                          {project.title[locale]}
                        </h3>
                      </div>
                      <span className="flex max-w-sm items-end gap-4 border-t border-white/25 pt-4 text-sm leading-6 text-white/70">
                        {project.summary[locale]}
                        <ArrowUpRight
                          aria-hidden="true"
                          className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-space bg-paper text-ink overflow-hidden">
        <Container className="grid grid-cols-12 items-center gap-y-10">
          <div className="col-span-11 md:col-span-8 lg:col-span-7">
            <ResponsiveMedia
              src={signaturePortrait.src}
              alt={signaturePortrait.alt[locale]}
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="border-ink/15 aspect-[2528/1696] rounded-none border"
              imageClassName="object-center"
            />
          </div>
          <div className="col-span-12 md:col-span-9 md:col-start-4 lg:col-span-5 lg:col-start-8 lg:-ml-20">
            <div className="border-ink/15 bg-paper relative border p-6 sm:p-10 lg:p-12">
              <p className="eyebrow text-muted">
                {fr ? "Derrière l'objectif" : "Behind the lens"}
              </p>
              <h2 className="font-display mt-6 text-[clamp(3.4rem,6vw,6.5rem)] leading-[0.87] tracking-[-0.045em]">
                {fr ? "Voir avant de déclencher." : "See before the shutter."}
              </h2>
              <p className="text-ink/65 mt-7 max-w-lg text-base leading-8">
                {fr
                  ? "Mohammed Laâchach photographie les personnes, les lieux et les gestes avec une approche calme, précise et profondément visuelle."
                  : "Mohammed Laâchach photographs people, places, and craft with a calm, precise, and deeply visual approach."}
              </p>
              <Link
                href="/about"
                className="group mt-8 inline-flex min-h-11 items-center gap-3 text-xs font-bold tracking-[0.13em] uppercase"
              >
                {fr ? "Découvrir Mohammed" : "Meet Mohammed"}
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform group-hover:translate-x-2"
                />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-space bg-surface text-paper">
        <Container>
          <div className="max-w-4xl">
            <h2 className="display-section">
              {fr ? "Une sélection en mouvement." : "A selection in motion."}
            </h2>
            <p className="mt-7 max-w-xl text-base leading-8 text-white/55">
              {fr
                ? "Portraits, espaces, détails et gestes alternent pour donner à chaque sujet sa juste échelle."
                : "Portraits, spaces, details, and gestures alternate to give every subject its right scale."}
            </p>
          </div>

          <div className="mt-16 grid grid-cols-12 items-start gap-3 sm:mt-24 sm:gap-6">
            {selectedWork.map(({ image, className }) => (
              <div
                key={image.src}
                className={`media-frame rounded-none border border-white/12 ${className}`}
                style={{ aspectRatio: `${image.width} / ${image.height}` }}
              >
                <Image
                  src={image.src}
                  alt={image.alt[locale]}
                  fill
                  sizes="(min-width: 768px) 65vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-space bg-ink text-paper">
        <Container>
          <div className="max-w-4xl">
            <p className="eyebrow text-sand">{fr ? "Méthode" : "Method"}</p>
            <h2 className="display-section mt-6">
              {fr
                ? "Une direction claire, du début à la livraison."
                : "Clear direction from start to delivery."}
            </h2>
          </div>
          <ol className="mt-16 border-t border-white/15 sm:mt-24">
            {process.map(([step, description], index) => (
              <li
                key={step}
                className="group grid gap-4 border-b border-white/15 py-6 sm:grid-cols-[4rem_1fr_1fr] sm:items-baseline sm:gap-8 sm:py-8"
              >
                <span className="text-sand text-xs font-bold tracking-[0.14em]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-4xl leading-none transition-transform duration-500 group-hover:translate-x-2 sm:text-5xl">
                  {step}
                </h3>
                <p className="max-w-md text-sm leading-7 text-white/55">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="group bg-paper text-ink border-ink/15 border-t">
        <Link
          href="/contact"
          className="hover:bg-sand block py-24 transition-colors duration-500 sm:py-36"
        >
          <Container className="grid grid-cols-12 gap-y-9">
            <h2 className="font-display col-span-12 text-[clamp(4rem,9vw,10rem)] leading-[0.8] tracking-[-0.055em] lg:col-span-10">
              {fr ? "Parlons de votre histoire." : "Let's tell your story."}
            </h2>
            <span className="col-span-12 inline-flex items-center gap-3 text-xs font-bold tracking-[0.14em] uppercase lg:col-span-2 lg:justify-end lg:self-end">
              {fr ? "Nous écrire" : "Write to us"}
              <ArrowUpRight
                aria-hidden="true"
                className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </span>
          </Container>
        </Link>
      </section>
    </>
  );
}
