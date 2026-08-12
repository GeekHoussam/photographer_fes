import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo/json-ld";
import { HomePage } from "@/components/sections/home-page";
import { isLocale } from "@/config/site";
import { getPageContent } from "@/features/content/pages";
import { createPageMetadata } from "@/lib/seo/metadata";
import { homePageJsonLd } from "@/lib/seo/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = getPageContent("home", locale);
  return createPageMetadata({
    locale,
    title: content.metaTitle,
    description: content.metaDescription,
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
      <JsonLd data={homePageJsonLd(locale)} />
      <HomePage locale={locale} />
    </>
  );
}
