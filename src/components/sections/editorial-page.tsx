import { ButtonLink } from "@/components/common/button";
import { Container } from "@/components/common/container";
import { ResponsiveMedia } from "@/components/common/responsive-media";
import { getPageContent } from "@/features/content/pages";
import type { Locale } from "@/config/site";
import { PageHero } from "./page-hero";

export function EditorialPage({
  locale,
  kind,
}: {
  locale: Locale;
  kind: "about" | "process" | "privacy" | "legal";
}) {
  const content = getPageContent(kind, locale);
  const visual = kind === "about" || kind === "process";
  const image =
    kind === "about"
      ? "/images/portfolio/personal/m2.webp"
      : "/images/portfolio/interiors/DSC01919.webp";
  const copy = {
    fr: {
      aboutAlt: "Mohammed Laâchach tenant une caméra de cinéma sur un plateau",
      processAlt: "Salon traditionnel de Fès aux boiseries sculptées",
      action: "Présenter votre projet",
    },
    en: {
      aboutAlt: "Mohammed Laâchach holding a cinema camera on set",
      processAlt: "Traditional Fez interior with carved woodwork",
      action: "Tell me about your project",
    },
    ar: {
      aboutAlt: "Mohammed Laâchach يحمل كاميرا سينمائية في موقع تصوير",
      processAlt: "غرفة جلوس تقليدية في فاس بأعمال خشبية منقوشة",
      action: "عرّف بمشروعك",
    },
  }[locale];
  const imageAlt = kind === "about" ? copy.aboutAlt : copy.processAlt;

  return (
    <>
      <PageHero
        eyebrow={content.eyebrow}
        title={content.h1}
        introduction={content.introduction}
        mediaSrc={image}
      />
      <section className="section-space bg-ink text-paper">
        <Container className="grid grid-cols-12 gap-y-14 lg:gap-x-12">
          {visual ? (
            <ResponsiveMedia
              src={image}
              alt={imageAlt}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="col-span-12 aspect-[4/5] lg:col-span-6"
            />
          ) : null}
          <div
            className={
              visual
                ? "col-span-12 lg:col-span-5 lg:col-start-8 lg:pt-20"
                : "col-span-12 max-w-3xl lg:col-span-7 lg:col-start-4"
            }
          >
            <p className="eyebrow text-sand">{content.eyebrow}</p>
            <h2 className="font-display mt-7 text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86] tracking-[-0.04em]">
              {content.h2}
            </h2>
            <p className="mt-9 max-w-2xl text-base leading-8 text-white/52">
              {content.body}
            </p>

            {kind === "process" && content.steps ? (
              <ol className="mt-12 border-t border-white/12">
                {content.steps.map((step, index) => (
                  <li
                    id={`step-${index + 1}`}
                    key={step.title}
                    className="border-b border-white/12 py-6"
                  >
                    <h3 className="font-display text-3xl leading-none">
                      {step.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-white/52">
                      {step.text}
                    </p>
                  </li>
                ))}
              </ol>
            ) : null}

            {visual ? (
              <ButtonLink href="/contact" variant="secondary" className="mt-9">
                {copy.action}
              </ButtonLink>
            ) : null}
          </div>
        </Container>
      </section>
    </>
  );
}
