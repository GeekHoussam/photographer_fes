import { EditorialPage } from "@/components/sections/editorial-page";
import { JsonLd } from "@/components/seo/json-ld";
import { isLocale } from "@/config/site";
import { getPageContent } from "@/features/content/pages";
import { createPageMetadata } from "@/lib/seo/metadata";
import { processPageJsonLd } from "@/lib/seo/structured-data";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = getPageContent("process", locale);
  return createPageMetadata({
    locale,
    path: content.path,
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
  return isLocale(locale) ? (
    <>
      <JsonLd data={processPageJsonLd(locale)} />
      <EditorialPage locale={locale} kind="process" />
    </>
  ) : null;
}
