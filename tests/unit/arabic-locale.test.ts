import { describe, expect, it } from "vitest";
import arMessages from "../../messages/ar.json";
import enMessages from "../../messages/en.json";
import frMessages from "../../messages/fr.json";
import sitemap from "@/app/sitemap";
import { brandTitles, locales, siteConfig } from "@/config/site";
import { staticPageContent } from "@/features/content/pages";
import { journalArticles } from "@/features/journal/articles";
import { categoryLabel, categoryOrder } from "@/features/portfolio/categories";
import { portfolioProjects } from "@/features/portfolio/projects";
import {
  portfolioVideos,
  videoCategoryDefinitions,
} from "@/features/portfolio/videos";
import { serviceMedia } from "@/features/services/media";
import { services } from "@/features/services/services";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  homePageJsonLd,
  journalArticleJsonLd,
  projectPageJsonLd,
  serializeJsonLd,
  servicePageJsonLd,
  type JsonLdDocument,
} from "@/lib/seo/structured-data";

type JsonObject = Record<string, unknown>;

function scalarKeyPaths(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    scalarKeyPaths(child, prefix ? `${prefix}.${key}` : key),
  );
}

function graph(document: JsonLdDocument) {
  return document["@graph"] as JsonObject[];
}

function entryOfType(document: JsonLdDocument, type: string) {
  return graph(document).find((entry) => entry["@type"] === type);
}

describe("Arabic locale completeness", () => {
  it("keeps identical scalar message paths in every locale", () => {
    const frPaths = scalarKeyPaths(frMessages).sort();
    expect(scalarKeyPaths(enMessages).sort()).toEqual(frPaths);
    expect(scalarKeyPaths(arMessages).sort()).toEqual(frPaths);
    expect(
      scalarKeyPaths(arMessages).every((path) => {
        const value = path
          .split(".")
          .reduce<unknown>(
            (current, key) =>
              typeof current === "object" && current !== null
                ? (current as Record<string, unknown>)[key]
                : undefined,
            arMessages,
          );
        return typeof value === "string" && value.trim().length > 0;
      }),
    ).toBe(true);
  });

  it("contains non-empty Arabic page, service, project, media, and video copy", () => {
    expect(locales).toEqual(["fr", "en", "ar"]);
    expect(brandTitles.ar).toContain("فاس");

    for (const page of Object.values(staticPageContent)) {
      expect(page.ar.metaTitle.trim().length).toBeGreaterThan(0);
      expect(page.ar.metaDescription.trim().length).toBeGreaterThan(0);
      expect(page.ar.h1.trim().length).toBeGreaterThan(0);
      expect(page.ar.introduction.trim().length).toBeGreaterThan(0);
      expect(
        page.ar.steps?.every((step) => step.title && step.text) ?? true,
      ).toBe(true);
    }

    for (const service of services) {
      expect(service.title.ar.trim().length).toBeGreaterThan(0);
      expect(service.introduction.ar.trim().length).toBeGreaterThan(0);
      expect(service.overviewTitle.ar.trim().length).toBeGreaterThan(0);
      expect(service.overview.ar.trim().length).toBeGreaterThan(0);
      expect(service.planningPoints.every((point) => point.ar.trim())).toBe(
        true,
      );
      expect(
        service.faqs.every(
          (faq) => faq.question.ar.trim() && faq.answer.ar.trim(),
        ),
      ).toBe(true);
      const media = serviceMedia(service.slug);
      expect(media.heroAlt.ar.trim().length).toBeGreaterThan(0);
      expect(media.secondaryAlt.ar.trim().length).toBeGreaterThan(0);
    }

    for (const project of portfolioProjects) {
      expect(project.title.ar.trim().length).toBeGreaterThan(0);
      expect(project.categoryLabel.ar.trim().length).toBeGreaterThan(0);
      expect(project.location.ar).toBe("فاس، المغرب");
      expect(project.summary.ar.trim().length).toBeGreaterThan(0);
      expect(project.description.ar.trim().length).toBeGreaterThan(0);
      expect(project.gallery.every((image) => image.alt.ar.trim())).toBe(true);
    }

    for (const category of categoryOrder) {
      expect(categoryLabel(category, "ar").trim().length).toBeGreaterThan(0);
    }
    expect(
      videoCategoryDefinitions.every(({ label }) => label.ar.trim().length > 0),
    ).toBe(true);
    expect(
      portfolioVideos.every(({ titleByLocale }) =>
        /[\u0600-\u06ff]/u.test(titleByLocale.ar),
      ),
    ).toBe(true);

    for (const article of journalArticles) {
      expect(article.content.ar.title.trim().length).toBeGreaterThan(0);
      expect(article.content.ar.body.length).toBe(
        article.content.fr.body.length,
      );
      expect(article.images.every((image) => image.alt.ar.trim())).toBe(true);
      expect(article.videos.every((video) => video.label.ar.trim())).toBe(true);
    }
  });

  it("builds Arabic metadata with reciprocal alternates and ar_MA Open Graph", () => {
    const page = staticPageContent.services.ar;
    const metadata = createPageMetadata({
      locale: "ar",
      path: "/services",
      title: page.metaTitle,
      description: page.metaDescription,
    });

    expect(metadata.alternates?.canonical).toBe(
      `${siteConfig.publicBaseUrl}/ar/services`,
    );
    expect(metadata.alternates?.languages).toEqual({
      fr: `${siteConfig.publicBaseUrl}/fr/services`,
      en: `${siteConfig.publicBaseUrl}/en/services`,
      ar: `${siteConfig.publicBaseUrl}/ar/services`,
      "x-default": `${siteConfig.publicBaseUrl}/fr/services`,
    });
    expect(metadata.openGraph).toMatchObject({
      locale: "ar_MA",
      alternateLocale: ["fr_FR", "en_GB"],
      title: expect.stringContaining(page.metaTitle),
      description: page.metaDescription,
    });
  });

  it("emits valid Arabic structured data with absolute verified URLs", () => {
    const documents = [
      homePageJsonLd("ar"),
      servicePageJsonLd("ar", services[0]!),
      projectPageJsonLd("ar", portfolioProjects[0]!),
      journalArticleJsonLd("ar", journalArticles[0]!),
    ];

    for (const document of documents) {
      expect(() => JSON.parse(serializeJsonLd(document))).not.toThrow();
      const serialized = JSON.stringify(document);
      expect(serialized).toContain('"inLanguage":"ar"');
      expect(serialized).toContain(siteConfig.publicBaseUrl);
    }

    expect(entryOfType(documents[0]!, "WebSite")).toMatchObject({
      inLanguage: ["fr", "en", "ar"],
    });
    expect(entryOfType(documents[0]!, "ProfessionalService")).toMatchObject({
      areaServed: { name: "المغرب" },
    });
  });

  it("adds one Arabic equivalent for every indexable route", () => {
    const entries = sitemap();
    const indexableStaticPages = Object.values(staticPageContent).filter(
      ({ indexable }) => indexable,
    ).length;
    const expectedPerLocale =
      indexableStaticPages +
      portfolioProjects.length +
      services.length +
      journalArticles.length;

    expect(entries).toHaveLength(expectedPerLocale * locales.length);
    expect(entries.filter(({ url }) => url.includes("/ar"))).toHaveLength(
      expectedPerLocale,
    );
    expect(
      entries.every(({ alternates }) =>
        (["fr", "en", "ar", "x-default"] as const).every((locale) =>
          Boolean(alternates?.languages?.[locale]),
        ),
      ),
    ).toBe(true);
  });
});
