import { describe, expect, it } from "vitest";
import {
  resolvePublicBaseUrl,
  siteConfig,
  withTrailingSlash,
} from "@/config/site";
import { getPageContent } from "@/features/content/pages";
import { portfolioProjects } from "@/features/portfolio/projects";
import { services } from "@/features/services/services";
import { createPageMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbJsonLd,
  entityIds,
  homePageJsonLd,
  portfolioPageJsonLd,
  projectPageJsonLd,
  serializeJsonLd,
  servicePageJsonLd,
  verifiedContactProperties,
  type JsonLdDocument,
} from "@/lib/seo/structured-data";
import sitemap from "@/app/sitemap";

type JsonObject = Record<string, unknown>;

function graph(data: JsonLdDocument) {
  return data["@graph"] as JsonObject[];
}

function entryOfType(data: JsonLdDocument, type: string) {
  return graph(data).find((entry) => entry["@type"] === type);
}

describe("metadata", () => {
  it("creates absolute reciprocal locale URLs and an x-default", () => {
    const metadata = createPageMetadata({
      locale: "en",
      path: "/services/wedding-photography",
      title: "Wedding photography",
      description: "Wedding coverage in Fès.",
    });

    expect(metadata.alternates?.canonical).toBe(
      `${siteConfig.publicBaseUrl}/en/services/wedding-photography`,
    );
    expect(metadata.alternates?.languages).toEqual({
      fr: `${siteConfig.publicBaseUrl}/fr/services/wedding-photography`,
      en: `${siteConfig.publicBaseUrl}/en/services/wedding-photography`,
      "x-default": `${siteConfig.publicBaseUrl}/fr/services/wedding-photography`,
    });
  });

  it("keeps thin and transitional routes out of the index", () => {
    for (const key of ["journal", "privacy", "legal", "thankYou"] as const) {
      expect(getPageContent(key, "fr").indexable).toBe(false);
    }
    const metadata = createPageMetadata({
      locale: "fr",
      path: "/journal",
      title: "Journal photographique",
      description: "Aucun article publié.",
      noIndex: true,
    });
    expect(metadata.robots).toMatchObject({ index: false, follow: true });
  });
});

describe("structured data", () => {
  it("serializes valid JSON and escapes script-breaking markup", () => {
    const serialized = serializeJsonLd({
      "@context": "https://schema.org",
      name: "</script><script>alert(1)</script>",
    });
    expect(serialized).not.toContain("<");
    expect(() => JSON.parse(serialized)).not.toThrow();
  });

  it("uses stable absolute entity IDs and locale-correct home content", () => {
    const fr = homePageJsonLd("fr");
    const en = homePageJsonLd("en");
    const frPage = entryOfType(fr, "WebPage");
    const enPage = entryOfType(en, "WebPage");

    expect(entityIds.person).toBe(`${siteConfig.publicBaseUrl}/#person`);
    expect(Object.values(entityIds).every((id) => URL.canParse(id))).toBe(true);
    expect(frPage).toMatchObject({
      inLanguage: "fr",
      url: `${siteConfig.publicBaseUrl}/fr`,
    });
    expect(enPage).toMatchObject({
      inLanguage: "en",
      url: `${siteConfig.publicBaseUrl}/en`,
    });
  });

  it("omits unconfigured or invalid private contact fields", () => {
    expect(
      verifiedContactProperties({
        email: null,
        phone: null,
        social: [{ label: "Invalid", url: "not-a-url" }],
      }),
    ).toEqual({});
  });

  it("builds a Service, visible FAQ, and absolute breadcrumb URLs", () => {
    const service = services[0]!;
    const data = servicePageJsonLd("en", service);
    const schema = entryOfType(data, "Service");
    const faq = entryOfType(data, "FAQPage");
    const breadcrumb = entryOfType(data, "BreadcrumbList");

    expect(schema).toMatchObject({
      name: service.title.en,
      inLanguage: "en",
      url: `${siteConfig.publicBaseUrl}/en/services/wedding-photography`,
      provider: { "@id": entityIds.business },
    });
    expect((faq?.mainEntity as unknown[]).length).toBe(service.faqs.length);
    expect(
      (breadcrumb?.itemListElement as JsonObject[]).every((item) =>
        URL.canParse(item.item as string),
      ),
    ).toBe(true);
  });

  it("builds collection and image-gallery data from published projects", () => {
    const collection = portfolioPageJsonLd("fr");
    const project = portfolioProjects[0]!;
    const detail = projectPageJsonLd("fr", project);
    const itemList = entryOfType(collection, "ItemList");
    const gallery = entryOfType(detail, "ImageGallery");

    expect(itemList?.numberOfItems).toBe(portfolioProjects.length);
    expect((gallery?.associatedMedia as unknown[]).length).toBe(
      project.gallery.length,
    );
    expect(gallery).toMatchObject({
      inLanguage: "fr",
      creator: { "@id": entityIds.person },
    });
  });

  it("numbers breadcrumbs from one", () => {
    const data = breadcrumbJsonLd([
      { name: "Home", url: "https://example.com/en" },
    ]);
    const items = data.itemListElement as JsonObject[];
    expect(items[0]?.position).toBe(1);
  });
});

describe("sitemap", () => {
  it("contains only canonical useful routes without invented dates", () => {
    const entries = sitemap();
    expect(entries.every((entry) => URL.canParse(entry.url))).toBe(true);
    expect(entries.some((entry) => entry.url.endsWith("/journal"))).toBe(false);
    expect(entries.some((entry) => entry.url.endsWith("/privacy"))).toBe(false);
    expect(entries.some((entry) => entry.url.endsWith("/legal"))).toBe(false);
    expect(entries.some((entry) => entry.url.endsWith("/thank-you"))).toBe(
      false,
    );
    expect(entries.every((entry) => entry.lastModified === undefined)).toBe(
      true,
    );
  });
});

describe("deployment URL handling", () => {
  it("adds a static-export base path exactly once", () => {
    expect(
      resolvePublicBaseUrl(
        "https://geekhoussam.github.io",
        "/photographer_fes",
      ),
    ).toBe("https://geekhoussam.github.io/photographer_fes");
    expect(
      resolvePublicBaseUrl(
        "https://geekhoussam.github.io/photographer_fes",
        "/photographer_fes",
      ),
    ).toBe("https://geekhoussam.github.io/photographer_fes");
  });

  it("uses canonical trailing slashes in static-export mode", () => {
    expect(withTrailingSlash("https://example.com/fr/services", true)).toBe(
      "https://example.com/fr/services/",
    );
    expect(withTrailingSlash("https://example.com/fr/services", false)).toBe(
      "https://example.com/fr/services",
    );
  });
});
