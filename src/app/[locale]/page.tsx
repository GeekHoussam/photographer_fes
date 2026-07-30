import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { HomePage } from "@/components/sections/home-page";
import { isLocale } from "@/config/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const fr = locale === "fr";
  return {
    title: fr
      ? "Photographe & vidéaste à Fès"
      : "Photographer & filmmaker in Fès",
    description: fr
      ? "Portfolio de Mohammed Laâchach : photographie et vidéo de mariage, événement, hôtellerie et gastronomie à Fès et au Maroc."
      : "Mohammed Laâchach's portfolio: wedding, event, hospitality, and food photography and film in Fès and across Morocco.",
    alternates: {
      canonical: `/${locale}`,
      languages: { fr: "/fr", en: "/en" },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  setRequestLocale(locale);
  return <HomePage locale={locale} />;
}
