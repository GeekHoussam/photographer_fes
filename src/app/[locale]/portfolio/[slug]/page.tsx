import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/common/button";
import { Container } from "@/components/common/container";
import { Lightbox } from "@/components/portfolio/lightbox";
import { isLocale } from "@/config/site";
import { portfolioProjects } from "@/features/portfolio/projects";
import { Link } from "@/i18n/navigation";

export function generateStaticParams() {
  return portfolioProjects.map((project) => ({ slug: project.slug }));
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
  const fr = locale === "fr";

  return (
    <article className="bg-ink text-paper">
      <header className="relative flex min-h-[92svh] items-end overflow-hidden pt-36 pb-12 sm:pb-16">
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
          <dl className="col-span-12 grid grid-cols-2 gap-7 border-t border-white/15 pt-6 text-sm sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            <div>
              <dt className="eyebrow text-white/38">
                {fr ? "Lieu" : "Location"}
              </dt>
              <dd className="mt-2 text-white/75">{project.location}</dd>
            </div>
            <div>
              <dt className="eyebrow text-white/38">{fr ? "Date" : "Date"}</dt>
              <dd className="mt-2 text-white/75">{project.year}</dd>
            </div>
            <div>
              <dt className="eyebrow text-white/38">Client</dt>
              <dd className="mt-2 text-white/75">
                {fr ? "Non renseigné" : "Not provided"}
              </dd>
            </div>
          </dl>
        </Container>
      </header>

      <section className="section-space">
        <Container className="grid grid-cols-12 gap-y-10">
          <p className="eyebrow text-sand col-span-12 lg:col-span-3">
            {fr ? "Le projet" : "The project"}
          </p>
          <div className="col-span-12 lg:col-span-7 lg:col-start-5">
            <p className="font-display text-[clamp(2.75rem,5vw,5.6rem)] leading-[0.92] tracking-[-0.035em]">
              {project.summary[locale]}
            </p>
            <p className="mt-9 max-w-2xl leading-8 text-white/48">
              {fr
                ? "Une sélection resserrée qui privilégie le rythme, la lumière et les gestes essentiels. Chaque image conserve sa place dans une séquence plutôt que dans un simple inventaire."
                : "A concise edit built around rhythm, light, and essential gestures. Each image earns its place in a sequence rather than a simple inventory."}
            </p>
          </div>
        </Container>
      </section>

      <Container className="pb-32">
        <Lightbox locale={locale} images={project.gallery} />
      </Container>

      <nav
        aria-label={fr ? "Projets adjacents" : "Adjacent projects"}
        className="border-y border-white/10"
      >
        <Container className="grid sm:grid-cols-2">
          <Link
            href={`/portfolio/${previous?.slug ?? project.slug}`}
            className="group border-b border-white/10 py-8 sm:border-r sm:border-b-0 sm:pr-10"
          >
            <span className="eyebrow text-sand flex items-center gap-2">
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              {fr ? "Projet précédent" : "Previous project"}
            </span>
            <span className="font-display mt-5 block text-4xl leading-none transition-transform group-hover:-translate-x-1">
              {previous?.title[locale]}
            </span>
          </Link>
          <Link
            href={`/portfolio/${next?.slug ?? project.slug}`}
            className="group py-8 sm:pl-10 sm:text-right"
          >
            <span className="eyebrow text-sand flex items-center justify-end gap-2">
              {fr ? "Projet suivant" : "Next project"}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </span>
            <span className="font-display mt-5 block text-4xl leading-none transition-transform group-hover:translate-x-1">
              {next?.title[locale]}
            </span>
          </Link>
        </Container>
      </nav>

      <section className="bg-sand text-ink relative overflow-hidden py-24">
        <Container className="relative flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <h2 className="font-display text-[clamp(3.75rem,7vw,7rem)] leading-[0.82] tracking-[-0.045em]">
            {fr ? "Un projet à raconter ?" : "A project to tell?"}
          </h2>
          <ButtonLink href="/contact" className="bg-ink text-paper">
            {fr ? "Parler du projet" : "Discuss the project"}
          </ButtonLink>
        </Container>
      </section>
    </article>
  );
}
