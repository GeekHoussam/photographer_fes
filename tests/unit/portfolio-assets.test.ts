import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  portfolioProjects,
  signaturePortrait,
} from "@/features/portfolio/projects";

const portfolioPhotos = portfolioProjects.flatMap((project) => project.gallery);

describe("curated portfolio assets", () => {
  it("references files that exist in public", () => {
    for (const photo of [...portfolioPhotos, signaturePortrait]) {
      expect(existsSync(join(process.cwd(), "public", photo.src))).toBe(true);
    }
  });

  it("does not repeat a selected photo across projects", () => {
    const paths = portfolioPhotos.map((photo) => photo.src);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("keeps the personal folder out of galleries and uses only m2 as the signature", () => {
    expect(
      portfolioPhotos.every((photo) => !photo.src.includes("/Personnels/")),
    ).toBe(true);
    expect(signaturePortrait.src).toBe("/images/portfolio/personal/m2.webp");
  });

  it("keeps the intended curated category counts", () => {
    expect(
      Object.fromEntries(
        portfolioProjects.map((project) => [
          project.category,
          project.gallery.length,
        ]),
      ),
    ).toEqual({ weddings: 3, events: 8, hospitality: 8, food: 12 });
  });
});
