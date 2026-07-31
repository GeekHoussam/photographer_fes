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
    path: "/about",
    title:
      locale === "fr" ? "À propos du photographe" : "About the photographer",
    description:
      locale === "fr"
        ? "Découvrez l'approche calme, précise et éditoriale de Mohammed Laâchach, photographe et vidéaste basé à Fès."
        : "Discover the calm, precise, editorial approach of Mohammed Laâchach, a photographer and filmmaker based in Fès.",
  });
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return isLocale(locale) ? (
    <EditorialPage locale={locale} kind="about" />
  ) : null;
}
