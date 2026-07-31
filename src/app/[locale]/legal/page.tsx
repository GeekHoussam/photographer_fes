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
    path: "/legal",
    title: locale === "fr" ? "Mentions légales" : "Legal notice",
    description:
      locale === "fr"
        ? "Mentions légales et informations relatives à l'édition du portfolio professionnel de Mohammed Laâchach."
        : "Legal notice and publishing information for Mohammed Laâchach's professional photography portfolio.",
  });
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return isLocale(locale) ? (
    <EditorialPage locale={locale} kind="legal" />
  ) : null;
}
