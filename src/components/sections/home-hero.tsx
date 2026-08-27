import Image from "next/image";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/config/site";
import { Container } from "@/components/common/container";
import { LensHero } from "@/components/three/lens-hero";
import { Link } from "@/i18n/navigation";
import { portfolioProjects } from "@/features/portfolio/projects";
import { getPageContent } from "@/features/content/pages";
import { HeroOrbitGallery } from "./hero-orbit-gallery";

export function HomeHero({ locale }: { locale: Locale }) {
  const page = getPageContent("home", locale);
  const copy = (
    {
      fr: {
        eyebrow: page.eyebrow,
        title: page.h1,
        intro: page.introduction,
        portfolio: "Voir les séries photographiques",
        quote: "Demander un devis",
        heroAlt: "Vidéaste filmant dans une rue de Fès",
        lensLabel:
          "Objectif 3D interactif. Glissez horizontalement ou utilisez les flèches pour le tourner. Touchez ou appuyez sur Entrée pour faire la mise au point.",
        lensHint: "Glissez · Touchez pour la mise au point",
      },
      en: {
        eyebrow: page.eyebrow,
        title: page.h1,
        intro: page.introduction,
        portfolio: "View the photography series",
        quote: "Request a quotation",
        heroAlt: "Filmmaker shooting on a street in Fez",
        lensLabel:
          "Interactive 3D lens. Swipe horizontally or use arrow keys to rotate. Tap or press Enter to focus.",
        lensHint: "Swipe to rotate · Tap to focus",
      },
      ar: {
        eyebrow: page.eyebrow,
        title: page.h1,
        intro: page.introduction,
        portfolio: "عرض السلاسل الفوتوغرافية",
        quote: "طلب عرض سعر",
        heroAlt: "صانع أفلام يصور في أحد شوارع فاس",
        lensLabel:
          "عدسة ثلاثية الأبعاد تفاعلية. اسحب أفقياً أو استخدم مفاتيح الأسهم لتدويرها. المس العدسة أو اضغط على مفتاح الإدخال لضبط التركيز.",
        lensHint: "اسحب للتدوير · المس لضبط التركيز",
      },
    } satisfies Record<
      Locale,
      {
        eyebrow: string;
        title: string;
        intro: string;
        portfolio: string;
        quote: string;
        heroAlt: string;
        lensLabel: string;
        lensHint: string;
      }
    >
  )[locale];

  const orbitItems = portfolioProjects.map((project) => ({
    href: `/portfolio/${project.slug}`,
    title: project.title[locale],
    src: project.cover.src,
    alt: project.cover.alt[locale],
  }));
  const titleLines = {
    fr: copy.title.replace(" vidéaste ", "\nvidéaste "),
    en: copy.title.replace(" and ", "\nand ").replace(" in Fez", "\nin Fez"),
    ar: copy.title
      .replace(" وصانع أفلام ", "\nوصانع أفلام ")
      .replace(" في فاس", "\nفي فاس"),
  }[locale].split("\n");

  return (
    <section className="theme-lock-dark reference-home-hero bg-ink text-paper relative min-h-[100svh] overflow-hidden pt-[var(--header-height)]">
      <div className="absolute inset-0">
        <Image
          src="/images/portfolio/personal/m3.png"
          alt={copy.heroAlt}
          fill
          priority
          sizes="100vw"
          className="hero-media-image object-cover"
        />
      </div>
      <div
        className="reference-home-hero-overlay pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <LensHero label={copy.lensLabel} hint={copy.lensHint} />
      <HeroOrbitGallery items={orbitItems} locale={locale} />

      <Container className="reference-home-hero-content relative z-[3] grid min-h-[calc(100svh-var(--header-height))] grid-cols-12 content-center gap-y-8 pt-20 pb-8 sm:pb-12 lg:items-end">
        <div className="reference-home-hero-copy col-span-12 lg:col-span-5 xl:col-span-6">
          <p className="eyebrow text-sand mb-7">{copy.eyebrow}</p>
          <h1 className="balance display-hero reference-home-hero-title max-w-[8ch]">
            {titleLines.map((line, index) => (
              <span key={line} className="reference-home-hero-title-line">
                {line}
                {index < titleLines.length - 1 ? " " : null}
              </span>
            ))}
          </h1>
        </div>

        <div className="reference-home-hero-intro col-span-12 grid max-w-xl gap-7 border-t border-white/20 pt-6 lg:col-span-5 lg:col-start-7 xl:col-span-4 xl:col-start-9">
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
