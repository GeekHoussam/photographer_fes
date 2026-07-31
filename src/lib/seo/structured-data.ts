import type { Locale } from "@/config/site";
import { siteConfig } from "@/config/site";

export function personJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#person`,
        name: siteConfig.name,
        url: siteConfig.url,
        image: `${siteConfig.url}/images/Photographe_fes_logo.png`,
        jobTitle:
          locale === "fr"
            ? "Photographe et vidéaste"
            : "Photographer and filmmaker",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Fès",
          addressCountry: "MA",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        name: siteConfig.name,
        url: siteConfig.url,
        inLanguage: locale,
        publisher: { "@id": `${siteConfig.url}/#person` },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${siteConfig.url}/#service`,
        name: siteConfig.name,
        url: siteConfig.url,
        description:
          locale === "fr"
            ? "Photographie et vidéo de mariage, événement, hôtellerie et gastronomie à Fès et au Maroc."
            : "Wedding, event, hospitality, and food photography and film in Fès and across Morocco.",
        areaServed: { "@type": "Country", name: "Morocco" },
        serviceType:
          locale === "fr"
            ? ["Photographie", "Production vidéo"]
            : ["Photography", "Video production"],
        provider: { "@id": `${siteConfig.url}/#person` },
      },
    ],
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
