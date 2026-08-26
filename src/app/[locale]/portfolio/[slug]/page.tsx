import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/common/button";
import { Container } from "@/components/common/container";
import { Lightbox } from "@/components/portfolio/lightbox";
import { JsonLd } from "@/components/seo/json-ld";
import { isLocale } from "@/config/site";
import { portfolioProjects } from "@/features/portfolio/projects";
import { Link } from "@/i18n/navigation";
import { createPageMetadata } from "@/lib/seo/metadata";
import { projectPageJsonLd } from "@/lib/seo/structured-data";
import type { Metadata } from "next";

export function generateStaticParams() {
  return portfolioProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const project = portfolioProjects.find((entry) => entry.slug === slug);
  if (!project) return {};
  return createPageMetadata({
    locale,
    path: `/portfolio/${slug}`,
    title: project.title[locale],
    description: project.summary[locale],
    image: project.cover.src,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return null;
  const projectIndex = portfolioProjects.findIndex(
    (entry) => entry.slug === slug,
  );
  const project = portfolioProjects[projectIndex];
  if (!project) notFound();
  const previous =
    portfolioProjects[
      (projectIndex - 1 + portfolioProjects.length) % portfolioProjects.length
    ];
  const next = portfolioProjects[(projectIndex + 1) % portfolioProjects.length];
  const copy = {
    fr: {
      location: "Lieu",
      published: "Série publiée",
      photographs: (count: number) => `${count} photographies`,
      breadcrumb: "Fil d’Ariane",
      home: "Accueil",
      portfolio: "Portfolio",
      series: "La série",
      service: (category: string) =>
        `Découvrir le service ${category.toLowerCase()}`,
      adjacent: "Projets adjacents",
      previous: "Projet précédent",
      next: "Projet suivant",
      contactTitle: "Un projet photo ou vidéo ?",
      action: "Présenter votre demande",
    },
    en: {
      location: "Location",
      published: "Published series",
      photographs: (count: number) => `${count} photographs`,
      breadcrumb: "Breadcrumb",
      home: "Home",
      portfolio: "Portfolio",
      series: "The series",
      service: (category: string) =>
        `Explore the ${category.toLowerCase()} service`,
      adjacent: "Adjacent projects",
      previous: "Previous project",
      next: "Next project",
      contactTitle: "A photography or film project?",
      action: "Describe your enquiry",
    },
    ar: {
      location: "المكان",
      published: "سلسلة منشورة",
      photographs: (count: number) => {
        const value = new Intl.NumberFormat("ar-MA").format(count);
        return `${value} ${count >= 3 && count <= 10 ? "صور فوتوغرافية" : "صورة فوتوغرافية"}`;
      },
      breadcrumb: "مسار التنقل",
      home: "الرئيسية",
      portfolio: "معرض الأعمال",
      series: "السلسلة",
      service: (category: string) => `اكتشف خدمة ${category}`,
      adjacent: "المشاريع المجاورة",
      previous: "المشروع السابق",
      next: "المشروع التالي",
      contactTitle: "هل لديك مشروع تصوير فوتوغرافي أو فيديو؟",
      action: "عرّف بطلبك",
    },
  }[locale];
  const relatedServiceByCategory = {
    weddings: "wedding-photography",
    events: "event-photography",
    hospitality: "hospitality-photography",
    food: "food-photography",
  } as const;
  const relatedService =
    relatedServiceByCategory[
      project.category as keyof typeof relatedServiceByCategory
    ];

  return (
    <article className="bg-ink text-paper">
      <JsonLd data={projectPageJsonLd(locale, project)} />
      <header className="theme-lock-dark relative flex min-h-[92svh] items-center overflow-hidden pt-36 pb-12 sm:pb-16">
        <Image
          src={project.cover.src}
          alt={project.cover.alt[locale]}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          className="object-cover opacity-65"
        />
        <div className="from-ink absolute inset-0 bg-gradient-to-t via-black/25 to-black/30" />
        <Container className="relative grid grid-cols-12 gap-y-10">
          <div className="col-span-12 lg:col-span-10">
            <p className="eyebrow text-sand">{project.categoryLabel[locale]}</p>
            <h1 className="balance display-page mt-7 max-w-[12ch]">
              {project.title[locale]}
            </h1>
          </div>
          <dl className="col-span-12 grid grid-cols-2 gap-7 border-t border-white/15 pt-6 text-sm lg:col-span-6 lg:col-start-7">
            <div>
              <dt className="eyebrow text-white/38">{copy.location}</dt>
              <dd className="mt-2 text-white/75">{project.location[locale]}</dd>
            </div>
            <div>
              <dt className="eyebrow text-white/38">{copy.published}</dt>
              <dd className="mt-2 text-white/75">
                {copy.photographs(project.gallery.length)}
              </dd>
            </div>
          </dl>
        </Container>
      </header>

      <section className="section-space">
        <Container className="grid grid-cols-12 gap-y-10">
          <nav
            aria-label={copy.breadcrumb}
            className="col-span-12 flex flex-wrap gap-2 text-xs tracking-[0.12em] text-white/45 uppercase"
          >
            <Link href="/">{copy.home}</Link>
            <span aria-hidden="true">/</span>
            <Link href="/portfolio">{copy.portfolio}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{project.title[locale]}</span>
          </nav>
          <p className="eyebrow text-sand col-span-12 lg:col-span-3">
            {copy.series}
          </p>
          <div className="col-span-12 lg:col-span-7 lg:col-start-5">
            <p className="font-display text-[clamp(2.75rem,5vw,5.6rem)] leading-[0.92] tracking-[-0.035em]">
              {project.summary[locale]}
            </p>
            <p className="mt-9 max-w-2xl leading-8 text-white/48">
              {project.description[locale]}
            </p>
            {relatedService ? (
              <Link
                href={`/services/${relatedService}`}
                className="text-link-arrow mt-8 inline-flex"
              >
                {copy.service(project.categoryLabel[locale])}
              </Link>
            ) : null}
          </div>
        </Container>
      </section>

      <Container className="pb-32">
        <Lightbox locale={locale} images={project.gallery} />
      </Container>

      <nav aria-label={copy.adjacent} className="border-y border-white/10">
        <Container className="grid sm:grid-cols-2">
          <Link
            href={`/portfolio/${previous?.slug ?? project.slug}`}
            className="group border-b border-white/10 py-8 sm:border-e sm:border-b-0 sm:pe-10"
          >
            <span className="eyebrow text-sand flex items-center gap-2">
              {locale === "ar" ? (
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              ) : (
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              )}
              {copy.previous}
            </span>
            <span
              className={`font-display mt-5 block text-4xl leading-none transition-transform ${locale === "ar" ? "group-hover:translate-x-1" : "group-hover:-translate-x-1"}`}
            >
              {previous?.title[locale]}
            </span>
          </Link>
          <Link
            href={`/portfolio/${next?.slug ?? project.slug}`}
            className="group py-8 sm:ps-10 sm:text-end"
          >
            <span className="eyebrow text-sand flex items-center justify-end gap-2">
              {copy.next}
              {locale === "ar" ? (
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              ) : (
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              )}
            </span>
            <span
              className={`font-display mt-5 block text-4xl leading-none transition-transform ${locale === "ar" ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
            >
              {next?.title[locale]}
            </span>
          </Link>
        </Container>
      </nav>

      <section className="bg-sand text-ink relative overflow-hidden py-24">
        <Container className="relative flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <h2 className="font-display text-[clamp(3.75rem,7vw,7rem)] leading-[0.82] tracking-[-0.045em]">
            {copy.contactTitle}
          </h2>
          <ButtonLink href="/contact" variant="inverse">
            {copy.action}
          </ButtonLink>
        </Container>
      </section>
    </article>
  );
}
