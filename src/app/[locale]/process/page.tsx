import { EditorialPage } from "@/components/sections/editorial-page";
import { isLocale } from "@/config/site";
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
