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
    path: "/privacy",
    title: locale === "fr" ? "Politique de confidentialité" : "Privacy policy",
    description:
      locale === "fr"
        ? "Informations sur l'utilisation des données envoyées dans le formulaire de contact du portfolio de Mohammed Laâchach."
        : "Information about how data submitted through Mohammed Laâchach's portfolio contact form is used.",
  });
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return isLocale(locale) ? (
    <EditorialPage locale={locale} kind="privacy" />
  ) : null;
}
