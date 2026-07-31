import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { siteConfig } from "@/config/site";

type PageMetadataInput = {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
};

export function createPageMetadata({
  locale,
  title,
  description,
  path = "",
  noIndex = false,
}: PageMetadataInput): Metadata {
  const normalizedPath = path && !path.startsWith("/") ? `/${path}` : path;
  const canonicalPath = `/${locale}${normalizedPath}`;
  const absoluteTitle = `${title} — ${siteConfig.name}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        fr: `/fr${normalizedPath}`,
        en: `/en${normalizedPath}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      alternateLocale: locale === "fr" ? ["en_GB"] : ["fr_FR"],
      title: absoluteTitle,
      description,
      url: canonicalPath,
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: absoluteTitle,
      description,
      images: ["/og.png"],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
