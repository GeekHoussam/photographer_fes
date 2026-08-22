import { expect, test } from "@playwright/test";

async function waitForHydration(page: import("@playwright/test").Page) {
  await page.locator('html[data-hydrated="true"]').waitFor();
}

const articles = [
  {
    slug: "photographe-mariage-fes",
    fr: "Votre photographe de mariage à Fès",
    en: "Your wedding photographer in Fez",
    videoIds: ["pgkUHijHiPc"],
  },
  {
    slug: "photographe-evenementiel-fes",
    fr: "Revivez votre événement en photo et vidéo",
    en: "Relive your event through photography and film",
    videoIds: ["HmHS5l-KxUw", "2qof4UTBzZk"],
  },
  {
    slug: "photographe-reseaux-sociaux-fes",
    fr: "Réussir votre présence sur les réseaux sociaux",
    en: "Build a stronger social media presence",
    videoIds: ["CkAa7Lae5LU", "a4PxHBb83PA"],
  },
] as const;

test("Journal indexes list the same three localized articles", async ({
  page,
}) => {
  for (const locale of ["fr", "en"] as const) {
    await page.goto(`/${locale}/journal`);
    await waitForHydration(page);
    await expect(page.locator("[data-journal-card]")).toHaveCount(3);
    await expect(
      page.locator("[data-journal-card]").getByText(/^\d{2}\s*\/\s*\d{2}$/),
    ).toHaveCount(0);
    await expect(
      page.getByText(/No published articles|Aucun article publié/),
    ).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute(
      "content",
      /noindex/,
    );

    for (const article of articles) {
      const title = article[locale];
      await expect(
        page.getByRole("heading", { level: 2, name: title }),
      ).toBeVisible();
      await expect(
        page
          .getByRole("link", {
            name: `${locale === "fr" ? "Lire l’article" : "Read article"} : ${title}`,
          })
          .first(),
      ).toHaveAttribute("href", `/${locale}/journal/${article.slug}`);
    }
  }
});

for (const locale of ["fr", "en"] as const) {
  for (const article of articles) {
    test(`${locale} Journal article ${article.slug} renders complete media, SEO, and interaction`, async ({
      page,
    }) => {
      const route = `/${locale}/journal/${article.slug}`;
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await waitForHydration(page);

      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        article[locale],
      );
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.locator("[data-journal-image]")).toHaveCount(2);
      await expect(page.locator("[data-journal-faq] h3")).toHaveCount(3);
      await expect(page.locator("[data-journal-video]")).toHaveCount(
        article.videoIds.length,
      );
      await expect(
        page.locator("iframe[data-journal-video-player]"),
      ).toHaveCount(0);
      await expect(
        page
          .getByRole("link", {
            name: locale === "fr" ? /Présenter|stratégie/ : /Describe/,
          })
          .first(),
      ).toBeVisible();

      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");
      expect(new URL(canonical!).pathname).toBe(route);
      for (const alternateLocale of ["fr", "en"] as const) {
        await expect(
          page.locator(`link[rel="alternate"][hreflang="${alternateLocale}"]`),
        ).toHaveAttribute(
          "href",
          new RegExp(`/${alternateLocale}/journal/${article.slug}/?$`),
        );
      }

      const firstPlay = page.locator("button[data-journal-video-play]").first();
      await firstPlay.focus();
      await expect(firstPlay).toBeFocused();
      expect(
        await firstPlay.evaluate(
          (button) =>
            Number.parseFloat(getComputedStyle(button).outlineWidth) > 0,
        ),
      ).toBe(true);
      await page.keyboard.press("Enter");
      const player = page.locator("iframe[data-journal-video-player]");
      await expect(player).toHaveCount(1);
      await expect(player).toHaveAttribute(
        "src",
        new RegExp(
          `youtube-nocookie\\.com/embed/${article.videoIds[0]}\\?autoplay=1&rel=0`,
        ),
      );

      const schema = await page
        .locator('script[type="application/ld+json"]')
        .allTextContents();
      expect(schema.join(" ")).not.toMatch(
        /datePublished|dateModified|uploadDate|VideoObject/,
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    });
  }
}

test("language switching keeps every Journal article slug", async ({
  page,
}) => {
  for (const article of articles) {
    await page.goto(`/fr/journal/${article.slug}`);
    await waitForHydration(page);
    if ((page.viewportSize()?.width ?? 1280) < 1024) {
      await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    }
    await page.getByRole("button", { name: "Switch to English" }).click();
    await expect(page).toHaveURL(new RegExp(`/en/journal/${article.slug}/?$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      article.en,
    );
  }
});

test("Journal routes remain readable without horizontal overflow at representative widths and themes", async ({
  page,
}) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1024, height: 900 },
    { width: 1440, height: 1000 },
  ]) {
    await page.setViewportSize(viewport);
    for (const theme of ["dark", "light"] as const) {
      await page.goto("/en", { waitUntil: "domcontentloaded" });
      await page.evaluate(
        (nextTheme) => localStorage.setItem("photographer-theme", nextTheme),
        theme,
      );
      for (const article of articles) {
        await page.goto(`/en/journal/${article.slug}`, {
          waitUntil: "domcontentloaded",
        });
        await waitForHydration(page);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        ).toBe(true);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await expect(page.locator("[data-journal-faq]")).toBeVisible();
      }
    }
  }
});
