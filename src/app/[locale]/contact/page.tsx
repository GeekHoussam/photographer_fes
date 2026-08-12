import { Container } from "@/components/common/container";
import { ContactForm } from "@/components/forms/contact-form";
import { ContactRouteOpener } from "@/components/contact/contact-route-opener";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { isLocale } from "@/config/site";
import { getPageContent } from "@/features/content/pages";
import { createPageMetadata } from "@/lib/seo/metadata";
import { contactPageJsonLd } from "@/lib/seo/structured-data";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = getPageContent("contact", locale);
  return createPageMetadata({
    locale,
    path: content.path,
    title: content.metaTitle,
    description: content.metaDescription,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const fr = locale === "fr";
  const content = getPageContent("contact", locale);
  return (
    <>
      <JsonLd data={contactPageJsonLd(locale)} />
      <ContactRouteOpener />
      <PageHero
        eyebrow={content.eyebrow}
        title={content.h1}
        introduction={content.introduction}
        mediaSrc="/images/portfolio/interiors/DSC02171.webp"
      />
      <section className="section-space bg-ink text-paper">
        <Container className="grid grid-cols-12 gap-y-14 lg:gap-x-12">
          <div className="col-span-12 lg:col-span-4">
            <p className="eyebrow text-sand">
              {fr ? "Votre demande" : "Your enquiry"}
            </p>
            <p className="mt-7 max-w-sm leading-8 text-white/48">
              {fr
                ? "Précisez aussi les personnes, espaces ou produits concernés, ainsi que les supports qui utiliseront les images."
                : "Also identify the people, spaces, or products involved and the channels where the images will be used."}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <ContactForm idPrefix="contact-page" />
          </div>
        </Container>
      </section>
    </>
  );
}
