import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactDialogProvider } from "@/components/contact/contact-dialog";
import { HydrationMarker } from "@/components/layout/hydration-marker";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <ContactDialogProvider>
        <HydrationMarker />
        <SmoothScroll />
        <a
          href="#main-content"
          className="bg-paper text-ink fixed top-4 left-4 z-[100] -translate-y-24 px-4 py-3 text-sm transition-transform focus:translate-y-0"
        >
          {locale === "fr" ? "Aller au contenu" : "Skip to content"}
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </ContactDialogProvider>
    </NextIntlClientProvider>
  );
}
