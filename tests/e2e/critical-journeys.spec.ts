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
    await page.getByRole("button", { name: "Portfolio" }).click();
    await page
      .getByRole("navigation", { name: "Navigation mobile" })
      .getByRole("link", { name: "Photos", exact: true })
      .click();
  } else {
    await page
      .getByRole("navigation", { name: "Navigation principale" })
      .getByRole("link", { name: "Portfolio", exact: true })
      .click();
  }
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

test("portfolio cards scrub through real project previews and open the series", async ({
  page,
}) => {
  await page.goto("/en/portfolio?media=photos");
  await waitForHydration(page);

  const preview = page.locator("[data-portfolio-preview]").first();
  await expect(preview).toHaveAttribute("data-active-preview", "0");
  await preview.scrollIntoViewIfNeeded();

  if ((page.viewportSize()?.width ?? 1280) < 1024) {
    await preview.click();
    await expect(page).toHaveURL(/\/en\/portfolio\/weddings-in-fes/);
    return;
  }

  const bounds = await preview.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(
    bounds!.x + bounds!.width * 0.86,
    bounds!.y + bounds!.height * 0.5,
  );
  await expect(preview).toHaveAttribute("data-active-preview", "2");
  await expect(page.getByText("Open series").first()).toBeVisible();

  await preview.click();
  await expect(page).toHaveURL(/\/en\/portfolio\/weddings-in-fes/);
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

test("portfolio submenu works with hover, keyboard, and touch", async ({
  page,
}) => {
  await page.goto("/en");
  await waitForHydration(page);
  const mobile = (page.viewportSize()?.width ?? 1280) < 1024;

  if (mobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
    const trigger = page.getByRole("button", { name: "Portfolio" });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("link", { name: "Videos", exact: true }).click();
  } else {
    const trigger = page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: "Portfolio", exact: true });
    await trigger.hover();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(
      page.getByRole("link", { name: "Videos", exact: true }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("heading", { level: 1 }).click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: "Services", exact: true })
      .focus();
    await trigger.focus();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("link", { name: "Videos", exact: true }).click();
  }

  await expect(page).toHaveURL(/\/en\/portfolio\?media=videos/);
  await expect(
    page.getByText("No video project is published yet."),
  ).toBeVisible();
});

test("portfolio filters preserve browser history", async ({ page }) => {
  await page.goto("/en/portfolio?media=photos");
  await waitForHydration(page);
  await page.getByRole("button", { name: "Videos" }).click();
  await expect(page).toHaveURL(/media=videos/);
  await page.getByRole("button", { name: "Photos" }).click();
  await expect(page).toHaveURL(/media=photos/);
  await page.goBack();
  await expect(page).toHaveURL(/media=videos/);
  await expect(
    page.getByText("No video project is published yet."),
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
  await expect
    .poll(() =>
      dialog.evaluate((node) => node.contains(document.activeElement)),
    )
    .toBe(true);
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe("hidden");
  await expect(
    dialog.getByRole("link", { name: /\+212 627-151618/ }),
  ).toHaveAttribute("href", "https://wa.me/212627151618");
  await expect(
    dialog.getByRole("link", { name: /Photography and general enquiries/ }),
  ).toHaveAttribute("href", "mailto:contact@photographefes.com");
  await expect(
    dialog.getByRole("link", { name: /Film projects/ }),
  ).toHaveAttribute("href", "mailto:mohammed.filmmaker@gmail.com");
  await expect(
    dialog.getByRole("link", { name: "Open the Contact page" }),
  ).toHaveAttribute("target", "_blank");
  for (let index = 0; index < 20; index += 1) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((node) => node.contains(document.activeElement)),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(
    mobile ? page.getByRole("button", { name: "Open menu" }) : trigger,
  ).toBeFocused();
});

test("shared Contact control opens the popup across localized pages", async ({
  page,
}) => {
  const routes = [
    { path: "/en/portfolio", menu: "Open menu" },
    { path: "/fr/services", menu: "Ouvrir le menu" },
    { path: "/en/about", menu: "Open menu" },
    { path: "/fr/contact", menu: "Ouvrir le menu" },
  ];

  for (const route of routes) {
    await page.goto(route.path);
    await waitForHydration(page);
    const mobile = (page.viewportSize()?.width ?? 1280) < 1024;
    if (mobile) {
      await page.getByRole("button", { name: route.menu }).click();
    }

    const contactLink = page
      .getByRole(mobile ? "navigation" : "banner", {
        name: mobile ? /navigation mobile|mobile navigation/i : undefined,
      })
      .getByRole("link", { name: "Contact", exact: true });

    if (!mobile && route.path === "/en/about") {
      await contactLink.evaluate((anchor) => {
        const textNode = Array.from(anchor.childNodes).find(
          (node) =>
            node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
        );
        textNode?.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            button: 0,
          }),
        );
      });
    } else {
      await contactLink.click();
    }

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: /close|fermer/i }).click();
    await expect(dialog).toBeHidden();
  }
});

test("page-level quotation links open the shared popup without navigating", async ({
  page,
}) => {
  await page.goto("/en");
  await waitForHydration(page);
  const initialUrl = page.url();
  await page
    .getByRole("main")
    .getByRole("link", { name: "Request a quotation", exact: true })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(page.url()).toBe(initialUrl);
});

test("direct Contact fallback renders without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const response = await page.goto("/en/contact");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Request a photography or film quotation.",
  );
  await expect(
    page.getByRole("link", { name: /Photography and general enquiries/ }),
  ).toHaveAttribute("href", "mailto:contact@photographefes.com");
  await context.close();
});

test("contact backdrop closes the dialog and the direct page stays available", async ({
  page,
}) => {
  await page.goto("/fr");
  await waitForHydration(page);
  const mobile = (page.viewportSize()?.width ?? 1280) < 1024;
  if (mobile) {
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  }
  await page
    .getByRole(mobile ? "navigation" : "banner", {
      name: mobile ? "Navigation mobile" : undefined,
    })
    .getByRole("link", { name: "Contact", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.locator("..").click({ position: { x: 4, y: 4 } });
  await expect(dialog).toBeHidden();

  await page.goto("/fr/contact");
  await waitForHydration(page);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Demander un devis photo ou vidéo.",
  );
  await expect(
    page.getByRole("link", { name: /Photographie et demandes générales/ }),
  ).toHaveAttribute("href", "mailto:contact@photographefes.com");
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

test("photo cards and galleries do not expose visual sequence indexes", async ({
  page,
}) => {
  await page.goto("/fr");
  await waitForHydration(page);
  await expect(page.getByText(/01\s*\/\s*Mariages/i)).toHaveCount(0);
  await expect(page.getByText(/02\s*\/\s*Événements/i)).toHaveCount(0);

  await page.goto("/fr/portfolio");
  await waitForHydration(page);
  await expect(page.getByText(/01\s*[·/]\s*Mariages/i)).toHaveCount(0);

  await page.goto("/fr/portfolio/weddings-in-fes");
  await waitForHydration(page);
  await expect(page.locator(".gallery-index")).toHaveCount(0);
  await page
    .getByRole("button", { name: /Agrandir/ })
    .first()
    .click();
  await expect(page.getByRole("dialog").getByText(/01\s*\/\s*03/)).toHaveCount(
    0,
  );
});

test("contact validation prevents an incomplete enquiry", async ({ page }) => {
  await page.goto("/en/contact");
  await waitForHydration(page);
  const main = page.getByRole("main");
  await main.getByRole("button", { name: "Send enquiry" }).click();
  await expect(main.getByRole("alert").first()).toBeVisible();
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
  const main = page.getByRole("main");
  await main.getByLabel("Name").fill("Example Person");
  await main.getByLabel("Email").fill("person@example.com");
  await main.getByLabel("Location").fill("Fès");
  await main
    .getByLabel("Your message")
    .fill("A complete demonstration enquiry for browser testing.");
  await main.getByLabel(/I agree/).check();
  await main.getByRole("button", { name: "Send enquiry" }).click();
  await expect(main.getByRole("status")).toContainText("Thank you");
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
      h1: "Photographe et cinéaste à Fès.",
      schemaTypes: ["Person", "WebSite", "ProfessionalService", "WebPage"],
    },
    {
      path: "/en",
      locale: "en",
      h1: "Photographer and filmmaker in Fès.",
      schemaTypes: ["Person", "WebSite", "ProfessionalService", "WebPage"],
    },
    {
      path: "/en/services/wedding-photography",
      locale: "en",
      h1: "Wedding photography",
      schemaTypes: ["Service", "BreadcrumbList"],
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
