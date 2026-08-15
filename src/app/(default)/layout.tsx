import type { Metadata } from "next";
import { RootDocument } from "@/app/root-document";
import { brandTitles, localizedUrl, siteConfig } from "@/config/site";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.publicBaseUrl),
  title: brandTitles.fr,
  description:
    "Accédez à la version française du portfolio de Mohammed Laâchach.",
  alternates: { canonical: localizedUrl("fr") },
  robots: { index: false, follow: true },
  icons: {
    icon: `${siteConfig.basePath}/images/Transparent%20square%20camera%20mark.png`,
    apple: `${siteConfig.basePath}/images/Transparent%20square%20camera%20mark.png`,
  },
};

export default function DefaultLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument lang="fr">{children}</RootDocument>;
}
