import { describe, expect, it } from "vitest";
import { breadcrumbJsonLd, personJsonLd } from "@/lib/seo/structured-data";

describe("structured data", () => {
  it("creates a Person without fabricated contact details", () => {
    const data = personJsonLd("fr");
    expect(data.name).toBe("Mohammed Laâchach");
    expect(data).not.toHaveProperty("telephone");
  });
  it("numbers breadcrumbs from one", () =>
    expect(
      breadcrumbJsonLd([{ name: "Home", url: "/" }]).itemListElement[0]
        ?.position,
    ).toBe(1));
});
