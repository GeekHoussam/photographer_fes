import {
  absoluteUrl,
  brandTitles,
  contactDetails,
  localizedUrl,
  siteConfig,
} from "@/config/site";
import type { Locale } from "@/config/site";
import { getPageContent } from "@/features/content/pages";
import { journalArticles } from "@/features/journal/articles";
import { portfolioProjects } from "@/features/portfolio/projects";
import { services } from "@/features/services/services";
import type {
  JournalArticle,
  JournalRichText,
  ProjectSummary,
  ServiceSummary,
} from "@/types/content";

type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdValue[]
  | { [key: string]: JsonLdValue | undefined };

export type JsonLdDocument = { [key: string]: JsonLdValue | undefined };

export const entityIds = {
  person: absoluteUrl("/#person"),
  website: absoluteUrl("/#website"),
  business: absoluteUrl("/#photography-service"),
} as const;

function languageName(locale: Locale) {
  return locale === "fr" ? "français" : "English";
}

function homeName(locale: Locale) {
  return locale === "fr" ? "Accueil" : "Home";
}

export function verifiedContactProperties(config: {
  email: string | null;
  phone: string | null;
  social: ReadonlyArray<{ label: string; url: string }>;
}) {
  const email = config.email?.trim();
  const phone = config.phone?.replace(/\D/g, "");
  const socialUrls = config.social
    .map(({ url }) => url)
    .filter((url) => {
      try {
        return ["http:", "https:"].includes(new URL(url).protocol);
      } catch {
        return false;
      }
    });
  return {
    ...(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? { email } : {}),
    ...(phone && phone.length >= 8 ? { telephone: `+${phone}` } : {}),
    ...(socialUrls.length > 0 ? { sameAs: socialUrls } : {}),
  };
}

function contactProperties() {
  return {
    ...verifiedContactProperties(siteConfig),
    email: [contactDetails.generalEmail, contactDetails.filmEmail],
  };
}

function personEntity(locale: Locale) {
  return {
    "@type": "Person",
    "@id": entityIds.person,
    name: siteConfig.name,
    url: localizedUrl(locale, "/about"),
    image: absoluteUrl("/images/portfolio/personal/m2.webp"),
    jobTitle:
      locale === "fr"
        ? "Photographe et vidéaste"
        : "Photographer and filmmaker",
    homeLocation: {
      "@type": "Place",
      name: locale === "fr" ? "Fès, Maroc" : "Fez, Morocco",
    },
    ...contactProperties(),
  };
}

function websiteEntity(locale: Locale) {
  return {
    "@type": "WebSite",
    "@id": entityIds.website,
    name: brandTitles[locale],
    url: siteConfig.publicBaseUrl,
    inLanguage: ["fr", "en"],
    publisher: { "@id": entityIds.person },
  };
}

function businessEntity(locale: Locale) {
  return {
    "@type": "ProfessionalService",
    "@id": entityIds.business,
    name: brandTitles[locale],
    url: localizedUrl(locale),
    description: getPageContent("home", locale).metaDescription,
    areaServed: {
      "@type": "Country",
      name: locale === "fr" ? "Maroc" : "Morocco",
    },
    ...contactProperties(),
  };
}

function webPageEntity(
  locale: Locale,
  path: string,
  name: string,
  description: string,
  type = "WebPage",
) {
  const url = localizedUrl(locale, path);
  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: locale,
    isPartOf: { "@id": entityIds.website },
    about: { "@id": entityIds.person },
  };
}

function breadcrumbFor(
  locale: Locale,
  items: Array<{ name: string; path: string }>,
) {
  return breadcrumbJsonLd(
    items.map((item) => ({
      name: item.name,
      url: localizedUrl(locale, item.path),
    })),
  );
}

export function serializeJsonLd(data: JsonLdDocument) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function homePageJsonLd(locale: Locale): JsonLdDocument {
  const content = getPageContent("home", locale);
  return {
    "@context": "https://schema.org",
    "@graph": [
      personEntity(locale),
      websiteEntity(locale),
      businessEntity(locale),
      {
        ...webPageEntity(
          locale,
          content.path,
          content.metaTitle,
          content.metaDescription,
        ),
        "@type": "WebPage",
        mainEntity: { "@id": entityIds.business },
      },
    ],
  };
}

export const personJsonLd = homePageJsonLd;

export function aboutPageJsonLd(locale: Locale): JsonLdDocument {
  const content = getPageContent("about", locale);
  return {
    "@context": "https://schema.org",
    "@graph": [
      personEntity(locale),
      {
        ...webPageEntity(
          locale,
          content.path,
          content.metaTitle,
          content.metaDescription,
          "AboutPage",
        ),
        "@type": "AboutPage",
        mainEntity: { "@id": entityIds.person },
      },
    ],
  };
}

export function contactPageJsonLd(locale: Locale): JsonLdDocument {
  const content = getPageContent("contact", locale);
  return {
    "@context": "https://schema.org",
    "@graph": [
      personEntity(locale),
      businessEntity(locale),
      {
        ...webPageEntity(
          locale,
          content.path,
          content.metaTitle,
          content.metaDescription,
          "ContactPage",
        ),
        "@type": "ContactPage",
        mainEntity: { "@id": entityIds.business },
      },
    ],
  };
}

export function servicesPageJsonLd(locale: Locale): JsonLdDocument {
  const content = getPageContent("services", locale);
  const url = localizedUrl(locale, content.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...webPageEntity(
          locale,
          content.path,
          content.metaTitle,
          content.metaDescription,
          "CollectionPage",
        ),
        "@type": "CollectionPage",
        mainEntity: { "@id": `${url}#services` },
      },
      {
        "@type": "ItemList",
        "@id": `${url}#services`,
        numberOfItems: services.length,
        itemListElement: services.map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: service.title[locale],
          url: localizedUrl(locale, `/services/${service.slug}`),
        })),
      },
    ],
  };
}

export function servicePageJsonLd(
  locale: Locale,
  service: ServiceSummary,
): JsonLdDocument {
  const path = `/services/${service.slug}`;
  const url = localizedUrl(locale, path);
  const description = service.introduction[locale];
  const serviceId = `${url}#service`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      personEntity(locale),
      businessEntity(locale),
      {
        ...webPageEntity(locale, path, service.title[locale], description),
        mainEntity: { "@id": serviceId },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "Service",
        "@id": serviceId,
        name: service.title[locale],
        description,
        url,
        serviceType: service.title[locale],
        areaServed: {
          "@type": "Country",
          name: locale === "fr" ? "Maroc" : "Morocco",
        },
        provider: { "@id": entityIds.business },
      },
      {
        ...breadcrumbFor(locale, [
          { name: homeName(locale), path: "" },
          {
            name: locale === "fr" ? "Services" : "Services",
            path: "/services",
          },
          { name: service.title[locale], path },
        ]),
        "@id": `${url}#breadcrumb`,
      },
    ],
  };
}

export function portfolioPageJsonLd(locale: Locale): JsonLdDocument {
  const content = getPageContent("portfolio", locale);
  const url = localizedUrl(locale, content.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...webPageEntity(
          locale,
          content.path,
          content.metaTitle,
          content.metaDescription,
          "CollectionPage",
        ),
        "@type": "CollectionPage",
        mainEntity: { "@id": `${url}#projects` },
      },
      {
        "@type": "ItemList",
        "@id": `${url}#projects`,
        numberOfItems: portfolioProjects.length,
        itemListElement: portfolioProjects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: project.title[locale],
          url: localizedUrl(locale, `/portfolio/${project.slug}`),
          image: absoluteUrl(project.cover.src),
        })),
      },
    ],
  };
}

function richTextPlainText(content: JournalRichText) {
  return content
    .map((segment) => (typeof segment === "string" ? segment : segment.text))
    .join("");
}

export function journalPageJsonLd(locale: Locale): JsonLdDocument {
  const content = getPageContent("journal", locale);
  const url = localizedUrl(locale, content.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      personEntity(locale),
      websiteEntity(locale),
      {
        ...webPageEntity(
          locale,
          content.path,
          content.metaTitle,
          content.metaDescription,
          "CollectionPage",
        ),
        "@type": "CollectionPage",
        mainEntity: { "@id": `${url}#articles` },
      },
      {
        "@type": "ItemList",
        "@id": `${url}#articles`,
        numberOfItems: journalArticles.length,
        itemListElement: journalArticles.map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: article.content[locale].title,
          url: localizedUrl(locale, `/journal/${article.slug}`),
          image: absoluteUrl(article.images[0].src),
        })),
      },
    ],
  };
}

export function journalArticleJsonLd(
  locale: Locale,
  article: JournalArticle,
): JsonLdDocument {
  const content = article.content[locale];
  const path = `/journal/${article.slug}`;
  const url = localizedUrl(locale, path);
  const webpageId = `${url}#webpage`;
  const articleId = `${url}#article`;
  const breadcrumbId = `${url}#breadcrumb`;
  const faqId = `${url}#faq`;
  const cover = article.images[0];

  return {
    "@context": "https://schema.org",
    "@graph": [
      personEntity(locale),
      websiteEntity(locale),
      {
        ...webPageEntity(
          locale,
          path,
          content.metaTitle,
          content.metaDescription,
        ),
        "@id": webpageId,
        mainEntity: { "@id": articleId },
        breadcrumb: { "@id": breadcrumbId },
      },
      {
        "@type": "BlogPosting",
        "@id": articleId,
        url,
        headline: content.title,
        description: content.metaDescription,
        image: {
          "@type": "ImageObject",
          url: absoluteUrl(cover.src),
          width: cover.width,
          height: cover.height,
          caption: cover.alt[locale],
        },
        author: { "@id": entityIds.person },
        publisher: { "@id": entityIds.person },
        mainEntityOfPage: { "@id": webpageId },
        isPartOf: { "@id": entityIds.website },
        inLanguage: locale,
      },
      {
        "@type": "FAQPage",
        "@id": faqId,
        url: `${url}#faq`,
        inLanguage: locale,
        mainEntity: content.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: richTextPlainText(faq.answer),
          },
        })),
      },
      {
        ...breadcrumbFor(locale, [
          { name: homeName(locale), path: "" },
          { name: "Journal", path: "/journal" },
          { name: content.title, path },
        ]),
        "@id": breadcrumbId,
      },
    ],
  };
}

export function projectPageJsonLd(
  locale: Locale,
  project: ProjectSummary,
): JsonLdDocument {
  const path = `/portfolio/${project.slug}`;
  const url = localizedUrl(locale, path);
  const galleryId = `${url}#gallery`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      personEntity(locale),
      {
        ...webPageEntity(
          locale,
          path,
          project.title[locale],
          project.summary[locale],
        ),
        mainEntity: { "@id": galleryId },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "ImageGallery",
        "@id": galleryId,
        name: project.title[locale],
        description: project.description[locale],
        url,
        inLanguage: locale,
        creator: { "@id": entityIds.person },
        contentLocation: {
          "@type": "Place",
          name: project.location[locale],
        },
        associatedMedia: project.gallery.map((image, index) => ({
          "@type": "ImageObject",
          "@id": `${url}#image-${index + 1}`,
          contentUrl: absoluteUrl(image.src),
          width: image.width,
          height: image.height,
          caption: image.alt[locale],
          inLanguage: locale,
          creator: { "@id": entityIds.person },
        })),
      },
      {
        ...breadcrumbFor(locale, [
          { name: homeName(locale), path: "" },
          { name: "Portfolio", path: "/portfolio" },
          { name: project.title[locale], path },
        ]),
        "@id": `${url}#breadcrumb`,
      },
    ],
  };
}

export function processPageJsonLd(locale: Locale): JsonLdDocument {
  const content = getPageContent("process", locale);
  const url = localizedUrl(locale, content.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      personEntity(locale),
      businessEntity(locale),
      {
        ...webPageEntity(
          locale,
          content.path,
          content.metaTitle,
          content.metaDescription,
        ),
        mainEntity: { "@id": `${url}#process` },
      },
      {
        "@type": "HowTo",
        "@id": `${url}#process`,
        name: content.h1,
        description: content.introduction,
        inLanguage: locale,
        provider: { "@id": entityIds.business },
        step: content.steps?.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: step.title,
          text: step.text,
          url: `${url}#step-${index + 1}`,
        })),
      },
    ],
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
): JsonLdDocument {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function languageLabel(locale: Locale) {
  return languageName(locale);
}
