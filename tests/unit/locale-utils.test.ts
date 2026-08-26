import { describe, expect, it } from "vitest";
import { isLocale } from "@/config/site";
import { localize, mapSlug } from "@/lib/sanity/mappers";

describe("locale helpers", () => {
  it("recognizes supported locales", () => {
    expect(isLocale("fr")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("ar")).toBe(true);
    expect(isLocale("de")).toBe(false);
  });
  it("falls back from a missing English translation", () =>
    expect(localize({ fr: "Bonjour" }, "en")).toBe("Bonjour"));
  it("maps Sanity slugs", () =>
    expect(mapSlug({ current: "project" })).toBe("project"));
});
