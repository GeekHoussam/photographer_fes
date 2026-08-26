import { ButtonLink } from "@/components/common/button";
import { Container } from "@/components/common/container";
import { createPageMetadata } from "@/lib/seo/metadata";
import { isLocale } from "@/config/site";
import { getPageContent } from "@/features/content/pages";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = getPageContent("thankYou", locale);
  return createPageMetadata({
    locale,
    path: content.path,
    title: content.metaTitle,
    description: content.metaDescription,
    noIndex: !content.indexable,
  });
}

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const content = getPageContent("thankYou", locale);
  const copy = {
    fr: {
      eyebrow: "Message envoyé",
      action: "Voir les séries photographiques",
    },
    en: {
      eyebrow: "Message sent",
      action: "View the photography series",
    },
    ar: {
      eyebrow: "تم إرسال الرسالة",
      action: "عرض السلاسل الفوتوغرافية",
    },
  }[locale];
  return (
    <section className="bg-ink text-paper flex min-h-[75vh] items-center pt-20">
      <Container>
        <p className="eyebrow text-sand">{copy.eyebrow}</p>
        <h1 className="display-page mt-6 max-w-4xl">{content.h1}</h1>
        <p className="mt-7 max-w-xl text-base leading-8 text-white/55">
          {content.introduction}
        </p>
        <ButtonLink href="/portfolio" className="bg-paper text-ink mt-10">
          {copy.action}
        </ButtonLink>
      </Container>
    </section>
  );
}
