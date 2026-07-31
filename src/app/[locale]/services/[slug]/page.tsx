import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/common/button";
import { Container } from "@/components/common/container";
import { ResponsiveMedia } from "@/components/common/responsive-media";
import { PageHero } from "@/components/sections/page-hero";
import { isLocale } from "@/config/site";
import { serviceMedia } from "@/features/services/media";
import { services } from "@/features/services/services";
import { createPageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

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
    description: `${service.introduction[locale]} ${
      locale === "fr"
        ? "Discutez de votre projet à Fès ou ailleurs au Maroc."
        : "Discuss your project in Fès or elsewhere in Morocco."
    }`,
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
  const items = fr
    ? [
        "Direction visuelle adaptée au projet",
        "Prise de vue préparée avec précision",
        "Sélection et finition cohérentes",
      ]
    : [
        "Visual direction tailored to the project",
        "A carefully prepared production",
        "Coherent selection and finishing",
      ];

  return (
    <>
      <PageHero
        eyebrow={fr ? "Service" : "Service"}
        title={service.title[locale]}
        introduction={service.introduction[locale]}
        mediaSrc={media.hero}
      />
      <section className="section-space bg-ink text-paper">
        <Container className="grid grid-cols-12 gap-y-12 lg:gap-x-12">
          <div className="col-span-12 lg:col-span-5">
            <p className="eyebrow text-sand">
              {fr ? "Description" : "Description"}
            </p>
            <h2 className="font-display mt-7 text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.85] tracking-[-0.045em]">
              {fr
                ? "Une méthode claire, adaptée à chaque sujet."
                : "A clear method, tailored to every subject."}
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7 lg:pt-20">
            <p className="text-base leading-8 text-white/52">
              {fr
                ? "Chaque collaboration commence par le contexte : l'usage des images, le lieu, le rythme et la manière dont elles seront vues. La préparation reste légère mais précise, afin que la prise de vue puisse conserver sa spontanéité."
                : "Every collaboration begins with context: how the images will be used, the place, the pace, and how they will be seen. Preparation stays light but precise so the shoot can retain its spontaneity."}
            </p>
            <ul className="mt-12 border-t border-white/12">
              {items.map((item, index) => (
                <li
                  key={item}
                  className="grid grid-cols-[3rem_1fr] border-b border-white/12 py-5"
                >
                  <span className="eyebrow text-sand">0{index + 1}</span>
                  <span className="text-sm text-white/70">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="theme-light section-space">
        <Container>
          <div className="grid grid-cols-12 gap-5 sm:gap-8">
            <ResponsiveMedia
              src={media.hero}
              alt={service.title[locale]}
              sizes="(min-width: 768px) 58vw, 100vw"
              className="col-span-12 aspect-[4/3] md:col-span-7"
            />
            <ResponsiveMedia
              src={media.secondary}
              alt={`${service.title[locale]} — ${fr ? "image sélectionnée" : "selected image"}`}
              sizes="(min-width: 768px) 42vw, 80vw"
              className="col-span-10 col-start-3 aspect-[4/5] md:col-span-5 md:col-start-8 md:mt-28"
            />
          </div>
        </Container>
      </section>

      <section className="section-space bg-surface text-paper border-t border-white/10">
        <Container>
          <div className="grid grid-cols-12 gap-y-10">
            <h2 className="display-section col-span-12 lg:col-span-5">FAQ</h2>
            <div className="col-span-12 lg:col-span-6 lg:col-start-7">
              <details className="border-y border-white/12 py-6">
                <summary className="cursor-pointer text-base font-medium">
                  {fr
                    ? "Comment préparer le projet ?"
                    : "How should the project be prepared?"}
                </summary>
                <p className="mt-5 max-w-2xl leading-8 text-white/48">
                  {fr
                    ? "Un premier échange permet de préciser l'intention, les contraintes du lieu, les usages attendus et le calendrier. Une proposition adaptée peut ensuite être préparée."
                    : "An initial conversation clarifies the intention, location constraints, intended uses, and timeline. A tailored proposal can then be prepared."}
                </p>
              </details>
              <ButtonLink href="/contact" className="mt-10">
                {fr ? "Demander un devis" : "Request a quote"}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
