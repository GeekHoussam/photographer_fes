import { expect, test } from "@playwright/test";

async function waitForHydration(page: import("@playwright/test").Page) {
  await page.locator('html[data-hydrated="true"]').waitFor();
}

test("homepage and main navigation render", async ({ page }) => {
  await page.goto("/fr");
  await waitForHydration(page);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  const mobile = (page.viewportSize()?.width ?? 1280) < 1024;
  if (mobile) {
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  }
  await page
    .getByRole("navigation", {
      name: mobile ? "Navigation mobile" : "Navigation principale",
    })
    .getByRole("link", { name: "Portfolio", exact: true })
    .click();
  await expect(page).toHaveURL(/\/fr\/portfolio/);
});

test("hero orbit gallery opens on desktop and falls back cleanly on mobile", async ({
  page,
}) => {
  await page.goto("/en");
  await waitForHydration(page);

  const trigger = page.locator(".hero-orbit-trigger");
  if ((page.viewportSize()?.width ?? 1280) < 1024) {
    await expect(trigger).toBeHidden();
    await expect(
      page.getByRole("link", { name: /View the photography series/i }).first(),
    ).toBeVisible();
    return;
  }

  await expect(trigger).toBeVisible();
  await expect(trigger).toHaveAccessibleName("Show gallery");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(trigger).toHaveAccessibleName("Hide gallery");
  await expect(
    page.locator(
      '.hero-orbit-card[aria-label="Ceremony, speakers, and audience"]',
    ),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toHaveAccessibleName("Show gallery");
});

test("language switching keeps the corresponding path", async ({ page }) => {
  await page.goto("/fr/services");
  await waitForHydration(page);
  if ((page.viewportSize()?.width ?? 1280) < 1024) {
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  }
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page).toHaveURL(/\/en\/services/);
});

test("portfolio filters synchronize with the URL", async ({ page }) => {
  await page.goto("/en/portfolio");
  await waitForHydration(page);
  await page.getByRole("button", { name: "Weddings" }).click();
  await expect(page).toHaveURL(/category=weddings/);
});

test("portfolio format filters show a translated video empty state", async ({
  page,
}) => {
  await page.goto("/fr/portfolio");
  await waitForHydration(page);
  await page.getByRole("button", { name: "Vidéos" }).click();
  await expect(page).toHaveURL(/media=videos/);
  await expect(
    page.getByText("Aucun projet vidéo n'est encore publié."),
  ).toBeVisible();
});

test("theme follows the system and persists a manual choice", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/en");
  await waitForHydration(page);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("global contact opens as a modal and restores trigger focus", async ({
  page,
}) => {
  await page.goto("/en");
  await waitForHydration(page);
  const mobile = (page.viewportSize()?.width ?? 1280) < 1024;
  if (mobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
  }
  const trigger = page
    .getByRole(mobile ? "navigation" : "banner", {
      name: mobile ? "Mobile navigation" : undefined,
    })
    .getByRole("link", { name: "Contact", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", {
    name: /Tell me about your project/,
  });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  if (mobile) {
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  } else {
    await expect(trigger).toBeFocused();
  }
});

test("lightbox supports keyboard navigation and escape", async ({ page }) => {
  await page.goto("/en/portfolio/weddings-in-fes");
  await waitForHydration(page);
  await page
    .getByRole("button", { name: /Enlarge/ })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("contact validation prevents an incomplete enquiry", async ({ page }) => {
  await page.goto("/en/contact");
  await waitForHydration(page);
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Send enquiry" }).click();
  await expect(dialog.getByRole("alert").first()).toBeVisible();
});

test("contact can complete with a mocked server response", async ({ page }) => {
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    }),
  );
  await page.goto("/en/contact");
  await waitForHydration(page);
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Name").fill("Example Person");
  await dialog.getByLabel("Email").fill("person@example.com");
  await dialog.getByLabel("Location").fill("Fès");
  await dialog
    .getByLabel("Your message")
    .fill("A complete demonstration enquiry for browser testing.");
  await dialog.getByLabel(/I agree/).check();
  await dialog.getByRole("button", { name: "Send enquiry" }).click();
  await expect(dialog.getByRole("status")).toContainText("Thank you");
});

test("reduced motion renders core content", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/en");
  await waitForHydration(page);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await context.close();
});

test("representative French and English pages expose aligned SEO signals", async ({
  page,
}) => {
  const cases = [
    {
      path: "/fr",
      locale: "fr",
      h1: "Photographe et vidéaste à Fès.",
      schemaTypes: ["Person", "WebSite", "ProfessionalService", "WebPage"],
    },
    {
      path: "/en/services/wedding-photography",
      locale: "en",
      h1: "Wedding photography",
      schemaTypes: ["Service", "FAQPage", "BreadcrumbList"],
    },
    {
      path: "/fr/portfolio/moroccan-interiors",
      locale: "fr",
      h1: "Riad et intérieurs marocains",
      schemaTypes: ["ImageGallery", "BreadcrumbList"],
    },
  ];

  for (const current of cases) {
    const response = await page.goto(current.path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", current.locale);
    await expect(page).toHaveTitle(/Mohammed Laâchach/);
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description?.trim().length).toBeGreaterThan(40);

    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(canonical && URL.canParse(canonical)).toBe(true);
    expect(new URL(canonical!).pathname).toBe(current.path);
    await expect(
      page.locator('link[rel="alternate"][hreflang="fr"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('link[rel="alternate"][hreflang="en"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('link[rel="alternate"][hreflang="x-default"]'),
    ).toHaveCount(1);

    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      current.h1,
    );
    const headingLevels = await page
      .locator("h1, h2, h3, h4, h5, h6")
      .evaluateAll((headings) =>
        headings.map((heading) => Number(heading.tagName.slice(1))),
      );
    expect(
      headingLevels.every(
        (level, index) => index === 0 || level <= headingLevels[index - 1]! + 1,
      ),
    ).toBe(true);

    const documents = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    expect(documents.length).toBeGreaterThan(0);
    const entries = documents.flatMap((text) => {
      const parsed = JSON.parse(text) as Record<string, unknown>;
      return Array.isArray(parsed["@graph"])
        ? (parsed["@graph"] as Record<string, unknown>[])
        : [parsed];
    });
    for (const schemaType of current.schemaTypes) {
      expect(entries.some((entry) => entry["@type"] === schemaType)).toBe(true);
    }
    expect(
      entries.some(
        (entry) =>
          ["WebPage", "CollectionPage"].includes(entry["@type"] as string) &&
          entry.url === canonical,
      ),
    ).toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
});

test("thin pages are noindex and unknown localized routes return 404", async ({
  page,
}) => {
  for (const path of [
    "/fr/journal",
    "/en/privacy",
    "/fr/legal",
    "/en/thank-you",
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
  }

  for (const path of [
    "/en/services/not-a-service",
    "/fr/portfolio/not-a-project",
    "/es",
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
  }
});
