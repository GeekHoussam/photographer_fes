import { expect, test } from "@playwright/test";
import { importedJournalArticles } from "../../src/features/journal/imported-articles";

for (const locale of ["fr", "en", "ar"] as const) {
  test(`${locale} Journal index includes all imported cards`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/journal`);
    await expect(page.locator("[data-journal-card]")).toHaveCount(9);
    for (const article of importedJournalArticles) {
      const card = page.locator(`[data-journal-card="${article.slug}"]`);
      await expect(card.locator("h2")).toHaveText(
        article.content[locale].title,
      );
      await expect(card.locator("a").first()).toHaveAttribute(
        "href",
        `/${locale}/journal/${article.slug}`,
      );
      await expect(card.locator("img")).toHaveAttribute(
        "alt",
        article.images[0].alt[locale],
      );
    }
  });

  for (const article of importedJournalArticles) {
    test(`${locale} imported article ${article.slug} renders text, images, tables, SEO and video`, async ({
      page,
    }, testInfo) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      const response = await page.goto(`/${locale}/journal/${article.slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute(
        "data-hydrated",
        "true",
      );
      await expect(page.locator("html")).toHaveAttribute(
        "dir",
        locale === "ar" ? "rtl" : "ltr",
      );
      await expect(page.locator("h1")).toHaveText(
        article.content[locale].title,
      );
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("[data-journal-image]")).toHaveCount(
        article.images.length - 1,
      );
      await expect(page.locator("[data-journal-faq] h3")).toHaveCount(
        article.content[locale].faqs.length,
      );
      const table = page.locator(".journal-table table");
      await expect(table).toHaveCount(1);
      await expect(table.locator("th[scope=col]")).toHaveCount(2);
      const text = (
        await page.locator("[data-journal-article]").innerText()
      ).replace(/\s+/g, " ");
      for (const block of article.content[locale].body) {
        if (block.type === "paragraph") {
          const paragraph = block.content
            .map((part) => (typeof part === "string" ? part : part.text))
            .join("");
          expect(text).toContain(paragraph.replace(/\s+/g, " "));
        }
      }
      for (const image of await page
        .locator("[data-journal-image] img")
        .all()) {
        await image.evaluate((element: HTMLImageElement) => {
          element.loading = "eager";
        });
        await expect(image).toHaveJSProperty("complete", true);
        expect(
          await image.evaluate(
            (element: HTMLImageElement) => element.naturalWidth,
          ),
        ).toBeGreaterThan(0);
        expect(await image.getAttribute("alt")).toBeTruthy();
      }
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        new RegExp(`/${locale}/journal/${article.slug}$`),
      );
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
        "content",
        "article",
      );
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        article.content[locale].metaDescription,
      );
      for (const alternate of ["fr", "en", "ar"]) {
        await expect(
          page.locator(`link[rel="alternate"][hreflang="${alternate}"]`),
        ).toHaveAttribute(
          "href",
          new RegExp(`/${alternate}/journal/${article.slug}$`),
        );
      }
      const schema = (
        await page
          .locator('script[type="application/ld+json"]')
          .allTextContents()
      ).join(" ");
      expect(schema).toContain('"BlogPosting"');
      expect(schema).toContain('"FAQPage"');
      expect(schema).not.toMatch(/datePublished|dateModified/);
      await expect(
        page.locator("[data-journal-article]").getByRole("link", {
          name: article.content[locale].contactAction,
          exact: true,
        }),
      ).toHaveAttribute("href", `/${locale}/contact`);
      await expect(page.locator("footer")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect(page.locator("[data-journal-video]")).toHaveCount(
        article.videos.length,
      );
      await expect(
        page.locator("iframe[data-journal-video-player]"),
      ).toHaveCount(0);
      // Verify the real generated iframe URL without relying on third-party player network requests.
      await page.route("https://www.youtube-nocookie.com/**", (route) =>
        route.fulfill({
          contentType: "text/html",
          body: "<html><body>Player request verified</body></html>",
        }),
      );
      for (const video of article.videos) {
        const figure = page.locator(`[data-journal-video="${video.videoId}"]`);
        await expect(figure.locator("a")).toHaveAttribute(
          "href",
          video.youtubeUrl,
        );
        await figure.locator("button").click();
        await expect(figure.locator("iframe")).toHaveAttribute(
          "src",
          `https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=0&rel=0`,
        );
      }
      if (
        article.slug === "photographe-fes-riad-hotellerie" &&
        locale === "ar"
      ) {
        await table.screenshot({
          path: testInfo.outputPath("table-ar.png"),
          style: "header.fixed { display: none !important; }",
        });
        await page.locator("[data-journal-article] > header").screenshot({
          path: testInfo.outputPath("hero-ar.png"),
        });
      }
      expect(errors).toEqual([]);
    });
  }
}
