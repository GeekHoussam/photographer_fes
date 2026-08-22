import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/common/button";
import { Container } from "@/components/common/container";
import { ResponsiveMedia } from "@/components/common/responsive-media";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { isLocale } from "@/config/site";
import { portfolioProjects } from "@/features/portfolio/projects";
import { serviceMedia } from "@/features/services/media";
import { services } from "@/features/services/services";
import { Link } from "@/i18n/navigation";
import { createPageMetadata } from "@/lib/seo/metadata";
import { servicePageJsonLd } from "@/lib/seo/structured-data";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const service = services.find((entry) => entry.slug === slug);
  if (!service) return {};
  return createPageMetadata({
    locale,
    path: `/services/${slug}`,
    title: service.title[locale],
    description: service.introduction[locale],
    image: serviceMedia(slug).hero,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return null;
  const service = services.find((entry) => entry.slug === slug);
  if (!service) notFound();
  const fr = locale === "fr";
  const media = serviceMedia(service.slug);
  const relatedProject = service.relatedProjectSlug
    ? portfolioProjects.find(
        (project) => project.slug === service.relatedProjectSlug,
      )
    : undefined;

  return (
    <>
      <JsonLd data={servicePageJsonLd(locale, service)} />
      <PageHero
        eyebrow={fr ? "Service" : "Service"}
        title={service.title[locale]}
        introduction={service.introduction[locale]}
        mediaSrc={media.hero}
      />

      <section className="section-space bg-ink text-paper">
        <Container>
          <nav
            aria-label={fr ? "Fil d’Ariane" : "Breadcrumb"}
            className="mb-14 flex flex-wrap gap-2 text-xs tracking-[0.12em] text-white/45 uppercase"
          >
            <Link href="/">{fr ? "Accueil" : "Home"}</Link>
            <span aria-hidden="true">/</span>
            <Link href="/services">Services</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{service.title[locale]}</span>
          </nav>

          <div className="grid grid-cols-12 gap-y-12 lg:gap-x-12">
            <div className="col-span-12 lg:col-span-5">
              <p className="eyebrow text-sand">
                {fr ? "Ce service" : "About this service"}
              </p>
              <h2 className="font-display mt-7 text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.85] tracking-[-0.045em]">
                {service.overviewTitle[locale]}
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:col-start-7 lg:pt-20">
              <p className="text-base leading-8 text-white/52">
                {service.overview[locale]}
              </p>
              <h3 className="eyebrow text-sand mt-12">
                {fr
                  ? "À préciser dans votre demande"
                  : "Include in your enquiry"}
              </h3>
              <ul className="mt-5 border-t border-white/12">
                {service.planningPoints.map((item) => (
                  <li
                    key={item[locale]}
                    className="border-b border-white/12 py-5"
                  >
                    <span className="text-sm text-white/70">
                      {item[locale]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="theme-light section-space">
        <Container>
          <div className="grid grid-cols-12 gap-5 sm:gap-8">
            <ResponsiveMedia
              src={media.hero}
              alt={media.heroAlt[locale]}
              sizes="(min-width: 768px) 58vw, 100vw"
              className="col-span-12 aspect-[4/3] md:col-span-7"
            />
            <ResponsiveMedia
              src={media.secondary}
              alt={media.secondaryAlt[locale]}
              sizes="(min-width: 768px) 42vw, 80vw"
              className="col-span-10 col-start-3 aspect-[4/5] md:col-span-5 md:col-start-8 md:mt-28"
            />
          </div>
          {relatedProject ? (
            <p className="mt-9 text-sm leading-7">
              <Link
                href={`/portfolio/${relatedProject.slug}`}
                className="text-link-arrow"
              >
                {fr
                  ? `Voir la série liée : ${relatedProject.title.fr}`
                  : `View the related series: ${relatedProject.title.en}`}
              </Link>
            </p>
          ) : null}
        </Container>
      </section>

      <section className="section-space bg-surface text-paper border-t border-white/10">
        <Container>
          <div className="grid grid-cols-12 gap-y-10">
            <h2 className="display-section col-span-12 lg:col-span-5">
              {fr ? "Questions fréquentes" : "Frequently asked questions"}
            </h2>
            <div className="col-span-12 lg:col-span-6 lg:col-start-7">
              {service.faqs.map((faq) => (
                <details
                  key={faq.question[locale]}
                  className="border-t border-white/12 py-6 last:border-b"
                >
                  <summary className="cursor-pointer text-base font-medium">
                    {faq.question[locale]}
                  </summary>
                  <p className="mt-5 max-w-2xl leading-8 text-white/48">
                    {faq.answer[locale]}
                  </p>
                </details>
              ))}
              <ButtonLink href="/contact" className="mt-10">
                {fr
                  ? "Présenter ce projet et demander un devis"
                  : "Describe this project and request a quotation"}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
