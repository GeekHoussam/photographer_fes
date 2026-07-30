import type { Locale } from "@/config/site";
import { siteConfig } from "@/config/site";

export function personJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle:
      locale === "fr"
        ? "Photographe et vidéaste"
        : "Photographer and filmmaker",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Fès",
      addressCountry: "MA",
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
