import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/config/site";
import { Container } from "@/components/common/container";
import { ResponsiveMedia } from "@/components/common/responsive-media";
import {
  portfolioProjects,
  signaturePortrait,
} from "@/features/portfolio/projects";
import { Link } from "@/i18n/navigation";
import { getPageContent } from "@/features/content/pages";
import { HomeHero } from "./home-hero";
import { ScrollTransitionFrames } from "./scroll-transition-frames";

export function HomePage({ locale }: { locale: Locale }) {
  const fr = locale === "fr";
  const processPage = getPageContent("process", locale);
  const selectedWork = [
    {
      image: portfolioProjects[3]!.gallery[5]!,
      project: portfolioProjects[3]!,
    },
    {
      image: portfolioProjects[1]!.gallery[3]!,
      project: portfolioProjects[1]!,
    },
    {
      image: portfolioProjects[2]!.gallery[1]!,
      project: portfolioProjects[2]!,
    },
    {
      image: portfolioProjects[0]!.gallery[1]!,
      project: portfolioProjects[0]!,
    },
    {
      image: portfolioProjects[3]!.gallery[8]!,
      project: portfolioProjects[3]!,
    },
    {
      image: portfolioProjects[2]!.gallery[7]!,
      project: portfolioProjects[2]!,
    },
  ];

  const process = processPage.steps ?? [];

  return (
    <>
      <HomeHero locale={locale} />

      <section className="section-space bg-ink text-paper">
        <Container>
          <div className="mb-14 max-w-4xl sm:mb-20">
            <p className="eyebrow text-sand">
              {fr ? "Séries publiées" : "Published series"}
            </p>
            <h2 className="display-section mt-6">
              {fr
                ? "Mariage, événement, intérieurs et gastronomie."
                : "Wedding, event, interiors, and food."}
            </h2>
          </div>

          <div className="space-y-5 md:space-y-8">
            {portfolioProjects.map((project, index) => (
              <article
                key={project.slug}
                className="theme-lock-dark group bg-ink relative overflow-hidden border border-white/12 md:sticky"
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
                {fr
                  ? "Un photographe et vidéaste basé à Fès."
                  : "A photographer and filmmaker based in Fès."}
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

      <section className="section-space bg-surface text-paper overflow-clip">
        <Container>
          <div className="max-w-4xl">
            <h2 className="display-section">
              {fr
                ? "Six photographies, quatre types de projets."
                : "Six photographs, four kinds of work."}
            </h2>
            <p className="mt-7 max-w-xl text-base leading-8 text-white/55">
              {fr
                ? "Cette sélection relie portraits de mariage, reportage d’événement, intérieurs marocains et travail en cuisine."
                : "This selection connects wedding portraits, event coverage, Moroccan interiors, and kitchen craft."}
            </p>
          </div>
        </Container>

        <ScrollTransitionFrames
          locale={locale}
          frames={selectedWork.map(({ image, project }) => ({
            image,
            category: project.categoryLabel[locale],
            title: project.title[locale],
          }))}
        />
      </section>

      <section className="section-space bg-ink text-paper">
        <Container>
          <div className="max-w-4xl">
            <p className="eyebrow text-sand">{fr ? "Méthode" : "Method"}</p>
            <h2 className="display-section mt-6">{processPage.h2}</h2>
          </div>
          <ol className="mt-16 border-t border-white/15 sm:mt-24">
            {process.map((step, index) => (
              <li
                key={step.title}
                className="group grid gap-4 border-b border-white/15 py-6 sm:grid-cols-[4rem_1fr_1fr] sm:items-baseline sm:gap-8 sm:py-8"
              >
                <span className="text-sand text-xs font-bold tracking-[0.14em]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-4xl leading-none transition-transform duration-500 group-hover:translate-x-2 sm:text-5xl">
                  {step.title}
                </h3>
                <p className="max-w-md text-sm leading-7 text-white/55">
                  {step.text}
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
              {fr
                ? "Présentez votre projet photo ou vidéo."
                : "Tell me about your photography or film project."}
            </h2>
            <span className="col-span-12 inline-flex items-center gap-3 text-xs font-bold tracking-[0.14em] uppercase lg:col-span-2 lg:justify-end lg:self-end">
              {fr ? "Demander un devis" : "Request a quotation"}
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
