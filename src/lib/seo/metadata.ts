import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { absoluteUrl, localizedUrl, siteConfig } from "@/config/site";

type PageMetadataInput = {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

export function createPageMetadata({
  locale,
  title,
  description,
  path = "",
  image = "/og.png",
  noIndex = false,
}: PageMetadataInput): Metadata {
  const canonical = localizedUrl(locale, path);
  const absoluteTitle = `${title} — ${siteConfig.name}`;
  const imageUrl = absoluteUrl(image);

  return {
    title: { absolute: absoluteTitle },
    description,
    alternates: {
      canonical,
      languages: {
        fr: localizedUrl("fr", path),
        en: localizedUrl("en", path),
        "x-default": localizedUrl("fr", path),
      },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      alternateLocale: locale === "fr" ? ["en_GB"] : ["fr_FR"],
      title: absoluteTitle,
      description,
      url: canonical,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: absoluteTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: true,
          googleBot: { index: false, follow: true },
        }
      : { index: true, follow: true },
  };
}
