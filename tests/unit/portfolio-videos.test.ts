import { describe, expect, it } from "vitest";
import {
  filterPortfolioVideos,
  getVideoEmbedUrl,
  portfolioVideos,
  videoCategoryDefinitions,
} from "@/features/portfolio/videos";

const expectedCategoryCounts = {
  "Commercial / Advertising": { "long-form": 1, short: 7, total: 8 },
  "Corporate Event": { "long-form": 11, short: 0, total: 11 },
  "Corporate Film": { "long-form": 5, short: 0, total: 5 },
  Documentary: { "long-form": 3, short: 0, total: 3 },
  Event: { "long-form": 8, short: 0, total: 8 },
  Showreel: { "long-form": 3, short: 0, total: 3 },
  Travel: { "long-form": 2, short: 0, total: 2 },
  "Video Clip / Music Video": { "long-form": 1, short: 0, total: 1 },
  Wedding: { "long-form": 3, short: 0, total: 3 },
};

describe("NOM Films portfolio video inventory", () => {
  it("contains the complete unique workbook inventory", () => {
    const videoIds = portfolioVideos.map((video) => video.videoId);
    const contentTypeCounts = portfolioVideos.reduce(
      (counts, video) => {
        counts[video.contentType] += 1;
        return counts;
      },
      { "long-form": 0, short: 0 },
    );

    expect(portfolioVideos).toHaveLength(44);
    expect(contentTypeCounts).toEqual({ "long-form": 37, short: 7 });
    expect(new Set(videoIds).size).toBe(44);
    expect(videoIds.every(Boolean)).toBe(true);
  });

  it("matches every workbook category total exactly", () => {
    const actualCounts = Object.fromEntries(
      videoCategoryDefinitions.map(({ workbookCategory }) => {
        const videos = portfolioVideos.filter(
          (video) => video.workbookCategory === workbookCategory,
        );
        return [
          workbookCategory,
          {
            "long-form": videos.filter(
              (video) => video.contentType === "long-form",
            ).length,
            short: videos.filter((video) => video.contentType === "short")
              .length,
            total: videos.length,
          },
        ];
      }),
    );

    expect(actualCounts).toEqual(expectedCategoryCounts);
  });

  it("uses known categories and valid deterministic YouTube URLs", () => {
    const knownCategories = new Set(
      videoCategoryDefinitions.map(({ slug }) => slug),
    );

    for (const video of portfolioVideos) {
      expect(knownCategories.has(video.category)).toBe(true);
      expect(video.videoId).toMatch(/^[A-Za-z0-9_-]{11}$/);
      expect(video.youtubeUrl).toBe(
        video.contentType === "short"
          ? `https://www.youtube.com/shorts/${video.videoId}`
          : `https://www.youtube.com/watch?v=${video.videoId}`,
      );
      expect(video.thumbnailUrl).toMatch(
        new RegExp(
          `^https://img\\.youtube\\.com/vi/${video.videoId}/(maxresdefault|sddefault|hqdefault)\\.jpg$`,
        ),
      );
      expect(getVideoEmbedUrl(video.videoId)).toBe(
        `https://www.youtube-nocookie.com/embed/${video.videoId}`,
      );
    }
  });

  it("filters each category without duplicating or reordering videos", () => {
    for (const definition of videoCategoryDefinitions) {
      const expected = portfolioVideos.filter(
        (video) => video.category === definition.slug,
      );
      expect(filterPortfolioVideos(definition.slug)).toEqual(expected);
    }

    expect(filterPortfolioVideos(null)).toEqual(portfolioVideos);
  });

  it("preserves official French and Arabic titles from the workbook", () => {
    expect(portfolioVideos.map((video) => video.title)).toContain(
      "Smedian 2025 - Photographe des Événements au Maroc",
    );
    expect(portfolioVideos.map((video) => video.title)).toContain(
      "الرابطة المحمدية للعلماء - الكلمة الافتتاحية للمنتدى الاقليمي - ا.د احمد عبادي",
    );
  });
});
