import type { Metadata } from "next";
import type { Locale } from "@/config/site";
import { absoluteUrl, brandTitles, localizedUrl } from "@/config/site";

type PageMetadataInput = {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  openGraphType?: "website" | "article";
  noIndex?: boolean;
};

export function createPageMetadata({
  locale,
  title,
  description,
  path = "",
  image = "/og.png",
  imageWidth = 1200,
  imageHeight = 630,
  openGraphType = "website",
  noIndex = false,
}: PageMetadataInput): Metadata {
  const canonical = localizedUrl(locale, path);
  const absoluteTitle =
    path === "" ? brandTitles[locale] : `${title} — Mohammed Laâchach`;
  const imageUrl = absoluteUrl(image);

  return {
    title: { absolute: absoluteTitle },
    description,
    alternates: {
      canonical,
      languages: {
        fr: localizedUrl("fr", path),
        en: localizedUrl("en", path),
        ar: localizedUrl("ar", path),
        "x-default": localizedUrl("fr", path),
      },
    },
    openGraph: {
      type: openGraphType,
      siteName: brandTitles[locale],
      locale: {
        fr: "fr_FR",
        en: "en_GB",
        ar: "ar_MA",
      }[locale],
      alternateLocale: {
        fr: ["en_GB", "ar_MA"],
        en: ["fr_FR", "ar_MA"],
        ar: ["fr_FR", "en_GB"],
      }[locale],
      title: absoluteTitle,
      description,
      url: canonical,
      images: [{ url: imageUrl, width: imageWidth, height: imageHeight }],
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
