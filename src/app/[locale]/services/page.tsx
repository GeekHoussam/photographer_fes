import { ArrowUpRight } from "lucide-react";
import { ResponsiveMedia } from "@/components/common/responsive-media";
import { Container } from "@/components/common/container";
import { PageHero } from "@/components/sections/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { Link } from "@/i18n/navigation";
import { isLocale } from "@/config/site";
import { getPageContent } from "@/features/content/pages";
import { serviceMedia } from "@/features/services/media";
import { services } from "@/features/services/services";
import { createPageMetadata } from "@/lib/seo/metadata";
import { servicesPageJsonLd } from "@/lib/seo/structured-data";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = getPageContent("services", locale);
  return createPageMetadata({
    locale,
    path: content.path,
    title: content.metaTitle,
    description: content.metaDescription,
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const content = getPageContent("services", locale);

  return (
    <>
      <JsonLd data={servicesPageJsonLd(locale)} />
      <PageHero
        eyebrow={content.eyebrow}
        title={content.h1}
        introduction={content.introduction}
        mediaSrc="/images/portfolio/interiors/DSC02171.webp"
      />
      <section className="section-space bg-ink text-paper">
        <Container>
          <div className="border-t border-white/12">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group grid gap-6 border-b border-white/12 py-8 lg:grid-cols-[1fr_18rem] lg:items-center lg:py-10"
              >
                <div>
                  <h2 className="font-display group-hover:text-sand text-[clamp(2.75rem,5vw,5.5rem)] leading-[0.88] tracking-[-0.04em] transition-colors">
                    {service.title[locale]}
                  </h2>
                  <p className="mt-5 max-w-xl text-sm leading-7 text-white/42">
                    {service.introduction[locale]}
                  </p>
                </div>
                <div className="relative hidden lg:block">
                  <ResponsiveMedia
                    src={serviceMedia(service.slug).hero}
                    alt={serviceMedia(service.slug).heroAlt[locale]}
                    sizes="18rem"
                    className="aspect-[16/10] translate-x-4 opacity-55 transition-all duration-700 group-hover:translate-x-0 group-hover:opacity-100"
                  />
                  <span className="bg-paper text-ink absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full">
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
