import { stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { localizedUrl } from "@/config/site";
import { journalArticles, journalSlugs } from "@/features/journal/articles";
import { getVideoEmbedUrl } from "@/features/portfolio/videos";
import {
  journalArticleJsonLd,
  journalPageJsonLd,
} from "@/lib/seo/structured-data";
import type { JournalVideo } from "@/types/content";

type JsonObject = Record<string, unknown>;

function graphEntries(document: JsonObject) {
  return document["@graph"] as JsonObject[];
}

function entryOfType(document: JsonObject, type: string) {
  return graphEntries(document).find((entry) => entry["@type"] === type);
}

describe("Journal article collection", () => {
  it("keeps exactly three unique slugs in the required editorial order", () => {
    expect(journalSlugs).toEqual([
      "photographe-mariage-fes",
      "photographe-evenementiel-fes",
      "photographe-reseaux-sociaux-fes",
    ]);
    expect(new Set(journalSlugs).size).toBe(3);
    expect(journalArticles.map((article) => article.order)).toEqual([1, 2, 3]);
  });

  it("contains complete, structurally equivalent French, English, and Arabic copy", () => {
    for (const article of journalArticles) {
      for (const locale of ["fr", "en", "ar"] as const) {
        const content = article.content[locale];
        expect(content.title.length).toBeGreaterThan(20);
        expect(content.summary.length).toBeGreaterThan(100);
        expect(content.metaTitle.length).toBeGreaterThan(20);
        expect(content.metaDescription.length).toBeGreaterThan(80);
        expect(
          content.body.filter(
            (block) => block.type === "heading" && block.level === 2,
          ).length,
        ).toBeGreaterThanOrEqual(2);
        expect(
          content.body.filter((block) => block.type === "paragraph").length,
        ).toBeGreaterThan(8);
        expect(content.faqs).toHaveLength(3);
        expect(content.faqs.every((faq) => faq.answer.length > 0)).toBe(true);
        expect(content.contactParagraphs.length).toBeGreaterThanOrEqual(2);
        expect(
          article.images.every((image) => image.alt[locale].length > 20),
        ).toBe(true);
        expect(
          article.videos.every((video) => video.label[locale].length > 20),
        ).toBe(true);
      }

      expect(
        article.content.fr.body.map((block) =>
          block.type === "heading"
            ? `${block.type}-${block.level}`
            : block.type,
        ),
      ).toEqual(
        article.content.en.body.map((block) =>
          block.type === "heading"
            ? `${block.type}-${block.level}`
            : block.type,
        ),
      );
      expect(article.content.fr.faqs).toHaveLength(
        article.content.en.faqs.length,
      );
      expect(
        article.content.ar.body.map((block) =>
          block.type === "heading"
            ? `${block.type}-${block.level}`
            : block.type,
        ),
      ).toEqual(
        article.content.fr.body.map((block) =>
          block.type === "heading"
            ? `${block.type}-${block.level}`
            : block.type,
        ),
      );
      expect(article.content.ar.faqs).toHaveLength(
        article.content.fr.faqs.length,
      );
      expect(JSON.stringify(article.content.en)).not.toMatch(
        /F(?:[èé]|e[\u0300\u0301])s/iu,
      );
      expect(JSON.stringify(article.content.fr)).toContain("Fès");
    }
  });

  it("records exactly three valid derived images per article", async () => {
    for (const article of journalArticles) {
      expect(article.images).toHaveLength(3);
      for (const image of article.images) {
        const filePath = path.join(process.cwd(), "public", image.src);
        expect((await stat(filePath)).size).toBeGreaterThan(10_000);
        const metadata = await sharp(filePath).metadata();
        expect(metadata.format).toBe("webp");
        expect(metadata.width).toBe(image.width);
        expect(metadata.height).toBe(image.height);
        expect(metadata.width).toBeLessThanOrEqual(2400);
        expect(metadata.height).toBeLessThanOrEqual(2400);
      }
    }
  });

  it("maps all five source videos once with deterministic URLs and formats", () => {
    const videos = journalArticles.reduce<JournalVideo[]>((items, article) => {
      items.push(...article.videos);
      return items;
    }, []);
    expect(videos.map((video) => video.videoId)).toEqual([
      "pgkUHijHiPc",
      "HmHS5l-KxUw",
      "2qof4UTBzZk",
      "CkAa7Lae5LU",
      "a4PxHBb83PA",
    ]);
    expect(new Set(videos.map((video) => video.videoId)).size).toBe(5);
    expect(videos.map((video) => video.aspect)).toEqual([
      "landscape",
      "landscape",
      "landscape",
      "portrait",
      "portrait",
    ]);

    for (const video of videos) {
      expect(video.videoId).toMatch(/^[A-Za-z0-9_-]{11}$/);
      expect(getVideoEmbedUrl(video.videoId)).toBe(
        `https://www.youtube-nocookie.com/embed/${video.videoId}`,
      );
      expect(video.youtubeUrl).toBe(
        video.aspect === "portrait"
          ? `https://www.youtube.com/shorts/${video.videoId}`
          : `https://www.youtube.com/watch?v=${video.videoId}`,
      );
    }
  });

  it("builds localized collection, article, FAQ, and breadcrumb schema without dates or VideoObject", () => {
    const collection = journalPageJsonLd("fr") as JsonObject;
    const itemList = entryOfType(collection, "ItemList");
    expect(itemList?.numberOfItems).toBe(3);
    expect(
      (itemList?.itemListElement as JsonObject[]).map((item) => item.position),
    ).toEqual([1, 2, 3]);

    for (const article of journalArticles) {
      for (const locale of ["fr", "en", "ar"] as const) {
        const schema = journalArticleJsonLd(locale, article) as JsonObject;
        const posting = entryOfType(schema, "BlogPosting");
        const faq = entryOfType(schema, "FAQPage");
        const serialized = JSON.stringify(schema);
        expect(posting).toMatchObject({
          url: localizedUrl(locale, `/journal/${article.slug}`),
          inLanguage: locale,
        });
        expect(
          (faq?.mainEntity as JsonObject[]).map((item) => item.name),
        ).toEqual(article.content[locale].faqs.map((item) => item.question));
        expect(entryOfType(schema, "BreadcrumbList")).toBeDefined();
        expect(serialized).not.toContain("datePublished");
        expect(serialized).not.toContain("dateModified");
        expect(serialized).not.toContain("uploadDate");
        expect(serialized).not.toContain("VideoObject");
        expect("publishedAt" in article).toBe(false);
        expect("modifiedAt" in article).toBe(false);
      }
    }
  });
});
