import { NextIntlClientProvider } from "next-intl";
import { RootDocument } from "@/app/root-document";
import { adminI18n } from "@/features/admin/server/locale";
import "@/styles/globals.css";
import "@/styles/admin.css";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function generateMetadata() {
  const { t } = await adminI18n();
  return {
    title: t("brand"),
    robots: { index: false, follow: false },
    referrer: "same-origin" as const,
  };
}
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, messages } = await adminI18n();
  return (
    <RootDocument lang={locale}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </RootDocument>
  );
}
