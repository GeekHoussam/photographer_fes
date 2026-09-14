import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { importedJournalArticles } from "@/features/journal/imported-articles";
import type {
  JournalArticle,
  JournalBodyBlock,
  JournalRichText,
} from "@/types/content";

function plain(text: JournalRichText) {
  return text
    .map((part) => (typeof part === "string" ? part : part.text))
    .join("");
}

function blockText(blocks: ReadonlyArray<JournalBodyBlock>): string[] {
  return blocks.flatMap((block) => {
    switch (block.type) {
      case "heading":
        return [block.text];
      case "paragraph":
        return [plain(block.content)];
      case "list":
        return block.items.map(plain);
      case "table":
        return [
          ...block.headers.map(plain),
          ...block.rows.flatMap((row) => row.map(plain)),
        ];
      default:
        return [];
    }
  });
}

// Derived independently from the six supplied French Markdown documents,
// excluding Markdown syntax and normalising whitespace only.
const sourceTextHashes = [
  "3c715572d2ef9ef77c024a513c610ecf979327fc632a0a0052b975521d6f8c6e",
  "22bdc1ac0346932fdcc7a73dd00c3b65daf4b615050b5eddf027d06ce454d516",
  "e172632e4b17fa907da27fca947aaf4f893308c4eb68c0da43a617387eb0ca02",
  "1a60457f284914ddca47a0c2699c39770a82405ccc7acd569120b6f6ccdab6d9",
  "7c0643525b20c911a3f3919120e07c5f493232e546af685b3eebf8b7e1cc78ba",
  "68daff48bf1ac7dbfa36f335ee930a144a4f0a922096a2334dd8173910035551",
];
const articles: ReadonlyArray<JournalArticle> = importedJournalArticles;

describe("Imported Journal source integrity", () => {
  it("preserves every French heading, paragraph, table cell, FAQ, conclusion and keyword in reading order", () => {
    articles.forEach((article, index) => {
      const content = article.content.fr;
      const text = [
        content.title,
        content.summary,
        ...blockText(content.body),
        content.faqIntroduction,
        ...content.faqs.flatMap((faq) => [faq.question, plain(faq.answer)]),
        ...blockText(content.afterFaqBody ?? []),
        content.contactTitle,
        ...content.contactParagraphs.map(plain),
      ]
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      expect(
        createHash("sha256").update(text).digest("hex"),
        article.slug,
      ).toBe(sourceTextHashes[index]);
    });
  });

  it("uses every supplied image and video once within each article, with valid references", () => {
    expect(articles.map((article) => article.images.length)).toEqual([
      7, 6, 3, 4, 6, 4,
    ]);
    expect(
      articles.map((article) => article.videos.map((video) => video.videoId)),
    ).toEqual([
      [],
      ["IY16AB5OVp8", "28uVq9QU8UE"],
      ["m13WS5HmRSw", "eo6C0Xbxm0g", "wFmxkMxjINs"],
      ["EyG3xDuvVD0", "Z3fSg0czUd8", "yW2tBt25E6Q"],
      ["a4PxHBb83PA", "2HNDtgh8cQE"],
      [],
    ]);
    for (const article of articles) {
      for (const locale of ["fr", "en", "ar"] as const) {
        const content = article.content[locale];
        const blocks = [...content.body, ...(content.afterFaqBody ?? [])];
        expect(
          blocks
            .filter((block) => block.type === "image")
            .map((block) => block.imageIndex)
            .sort((a, b) => a - b),
        ).toEqual(article.images.slice(1).map((_, index) => index + 1));
        expect(
          blocks
            .filter((block) => block.type === "videos")
            .flatMap((block) => block.videoIndexes),
        ).toEqual(article.videos.map((_, index) => index));
        const tables = blocks.filter((block) => block.type === "table");
        expect(tables).toHaveLength(1);
        expect(
          tables.every((table) =>
            table.rows.every((row) => row.length === table.headers.length),
          ),
        ).toBe(true);
        expect(content.faqs.length).toBe(
          article.slug.endsWith("team-building") ? 5 : 4,
        );
        expect(JSON.stringify(content)).not.toMatch(/Ã©|Ã¨|â€™|\uFFFD/);
      }
      expect(article.videos.every((video) => video.autoplay === false)).toBe(
        true,
      );
      expect(new Set(article.images.map((image) => image.src)).size).toBe(
        article.images.length,
      );
    }
  });
});
