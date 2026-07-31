import Image from "next/image";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/config/site";
import { Container } from "@/components/common/container";
import { LensHero } from "@/components/three/lens-hero";
import { Link } from "@/i18n/navigation";
import { portfolioProjects } from "@/features/portfolio/projects";
import { HeroOrbitGallery } from "./hero-orbit-gallery";

export function HomeHero({ locale }: { locale: Locale }) {
  const fr = locale === "fr";
  const copy = fr
    ? {
        eyebrow: "Photographe & vidéaste à Fès",
        title: "La lumière révèle l'histoire.",
        intro:
          "Mariages, lieux, gastronomie et événements photographiés avec précision et présence.",
        portfolio: "Voir le portfolio",
        quote: "Nous écrire",
      }
    : {
        eyebrow: "Photographer & filmmaker in Fès",
        title: "Light reveals the story.",
        intro:
          "Weddings, spaces, food, and events photographed with precision and presence.",
        portfolio: "View portfolio",
        quote: "Write to us",
      };

  const orbitItems = portfolioProjects.map((project) => ({
    href: `/portfolio/${project.slug}`,
    title: project.title[locale],
    src: project.cover.src,
    alt: project.cover.alt[locale],
  }));

  return (
    <section className="theme-lock-dark reference-home-hero bg-ink text-paper relative min-h-[100svh] overflow-hidden pt-[var(--header-height)]">
      <div className="absolute inset-0">
        <Image
          src="/images/portfolio/personal/m3.png"
          alt={
            fr
              ? "Vidéaste filmant dans une rue de Fès"
              : "Filmmaker shooting on a street in Fès"
          }
          fill
          priority
          sizes="100vw"
          className="hero-media-image object-cover"
        />
      </div>
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,17,18,0.97)_0%,rgba(16,17,18,0.76)_42%,rgba(16,17,18,0.28)_72%,rgba(16,17,18,0.18)_100%)]"
        aria-hidden="true"
      />
      <div
        className="from-ink absolute inset-0 bg-gradient-to-t via-transparent to-black/45"
        aria-hidden="true"
      />
      <LensHero />
      <HeroOrbitGallery items={orbitItems} locale={locale} />

      <Container className="relative z-[3] grid min-h-[calc(100svh-var(--header-height))] grid-cols-12 content-end gap-y-8 pt-20 pb-8 sm:pb-12 lg:items-end">
        <div className="col-span-12 lg:col-span-9">
          <p className="eyebrow text-sand mb-7">{copy.eyebrow}</p>
          <h1 className="balance display-hero max-w-[9ch]">{copy.title}</h1>
        </div>

        <div className="col-span-12 grid max-w-xl gap-7 border-t border-white/20 pt-6 lg:col-span-5 lg:col-start-7">
          <p className="text-base leading-7 text-white/72">{copy.intro}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/portfolio"
              className="group hover:border-sand hover:text-sand relative inline-flex min-h-12 items-center gap-4 border border-white/45 px-5 text-xs font-bold tracking-[0.13em] uppercase transition-colors"
            >
              <span className="border-paper absolute -top-px -left-px h-2.5 w-2.5 border-t border-l transition-all group-hover:h-4 group-hover:w-4" />
              <span className="border-paper absolute -right-px -bottom-px h-2.5 w-2.5 border-r border-b transition-all group-hover:h-4 group-hover:w-4" />
              {copy.portfolio}
              <ArrowDownRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="group hover:text-sand inline-flex min-h-12 items-center gap-3 px-2 text-xs font-bold tracking-[0.13em] uppercase underline decoration-white/35 underline-offset-8 transition-colors"
            >
              {copy.quote}
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
