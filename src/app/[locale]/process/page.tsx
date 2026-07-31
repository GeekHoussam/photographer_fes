import { EditorialPage } from "@/components/sections/editorial-page";
import { isLocale } from "@/config/site";
import { createPageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return createPageMetadata({
    locale,
    path: "/process",
    title:
      locale === "fr"
        ? "Approche photo et vidéo"
        : "Photography and film process",
    description:
      locale === "fr"
        ? "Une méthode claire pour préparer, photographier, filmer et livrer une série cohérente, adaptée à chaque projet à Fès et au Maroc."
        : "A clear process to prepare, photograph, film, and deliver a coherent series tailored to each project in Fès and across Morocco.",
  });
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return isLocale(locale) ? (
    <EditorialPage locale={locale} kind="process" />
  ) : null;
}
