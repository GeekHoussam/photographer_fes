import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { HomePage } from "@/components/sections/home-page";
import { isLocale } from "@/config/site";
import { createPageMetadata } from "@/lib/seo/metadata";
import { personJsonLd } from "@/lib/seo/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const fr = locale === "fr";
  return createPageMetadata({
    locale,
    title: fr
      ? "Photographe & vidéaste à Fès"
      : "Photographer & filmmaker in Fès",
    description: fr
      ? "Portfolio de Mohammed Laâchach : photographie et vidéo de mariage, événement, hôtellerie et gastronomie à Fès et au Maroc."
      : "Mohammed Laâchach's portfolio: wedding, event, hospitality, and food photography and film in Fès and across Morocco.",
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  setRequestLocale(locale);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd(locale)),
        }}
      />
      <HomePage locale={locale} />
    </>
  );
}
