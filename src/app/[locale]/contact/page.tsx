import { Container } from "@/components/common/container";
import { ContactMethods } from "@/components/contact/contact-methods";
import { ContactForm } from "@/components/forms/contact-form";
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
  const content = getPageContent("contact", locale);
  const copy = {
    fr: {
      eyebrow: "Votre demande",
      help: "Précisez aussi les personnes, espaces ou produits concernés, ainsi que les supports qui utiliseront les images.",
    },
    en: {
      eyebrow: "Your enquiry",
      help: "Also identify the people, spaces, or products involved and the channels where the images will be used.",
    },
    ar: {
      eyebrow: "طلبك",
      help: "حدّد أيضًا الأشخاص أو الفضاءات أو المنتجات المعنية، والوسائط التي ستستخدم فيها الصور.",
    },
  }[locale];
  return (
    <>
      <JsonLd data={contactPageJsonLd(locale)} />
      <PageHero
        eyebrow={content.eyebrow}
        title={content.h1}
        introduction={content.introduction}
        mediaSrc="/images/portfolio/interiors/DSC02171.webp"
      />
      <section className="section-space bg-ink text-paper">
        <Container className="grid grid-cols-12 gap-y-14 lg:gap-x-12">
          <div className="col-span-12 lg:col-span-4">
            <p className="eyebrow text-sand">{copy.eyebrow}</p>
            <p className="mt-7 max-w-sm leading-8 text-white/48">{copy.help}</p>
            <ContactMethods className="mt-9" />
          </div>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <ContactForm idPrefix="contact-page" />
          </div>
        </Container>
      </section>
    </>
  );
}
