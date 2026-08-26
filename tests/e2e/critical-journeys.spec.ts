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

test("homepage hero copy stays inside the viewport without effect collisions", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name === "mobile",
    "The explicit viewport matrix already includes mobile widths",
  );
  test.setTimeout(90_000);
  const viewports = [
    { width: 360, height: 640 },
    { width: 390, height: 720 },
    { width: 768, height: 800 },
    { width: 1024, height: 600 },
    { width: 1280, height: 720 },
    { width: 1440, height: 800 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await waitForHydration(page);

    const metrics = await page
      .locator(".reference-home-hero")
      .evaluate((hero) => {
        const title = hero.querySelector<HTMLElement>(
          ".reference-home-hero-title",
        );
        if (!title) throw new Error("Hero title is missing");

        const visibleRect = (selector: string) => {
          const element = hero.querySelector<HTMLElement>(selector);
          if (!element || getComputedStyle(element).display === "none") {
            return null;
          }
          const bounds = element.getBoundingClientRect();
          return {
            top: bounds.top,
            right: bounds.right,
            bottom: bounds.bottom,
            left: bounds.left,
          };
        };
        const overlaps = (
          first: ReturnType<typeof visibleRect>,
          second: ReturnType<typeof visibleRect>,
        ) =>
          Boolean(
            first &&
            second &&
            first.left < second.right &&
            first.right > second.left &&
            first.top < second.bottom &&
            first.bottom > second.top,
          );

        const heroRect = hero.getBoundingClientRect();
        const titleRect = visibleRect(".reference-home-hero-title");
        const lensRect = visibleRect(".hero-lens-3d");
        const galleryRect = visibleRect(".hero-orbit-gallery");
        let ancestor: HTMLElement | null = title;
        let translucentTextAncestor = false;
        while (ancestor && ancestor !== hero.parentElement) {
          if (Number.parseFloat(getComputedStyle(ancestor).opacity) < 1) {
            translucentTextAncestor = true;
            break;
          }
          ancestor = ancestor.parentElement;
        }

        return {
          documentWidth: document.documentElement.scrollWidth,
          galleryVisible: galleryRect !== null,
          hero: {
            top: heroRect.top,
            right: heroRect.right,
            bottom: heroRect.bottom,
            left: heroRect.left,
          },
          title: titleRect,
          titleCollidesWithGallery: overlaps(titleRect, galleryRect),
          titleCollidesWithLens: overlaps(titleRect, lensRect),
          translucentTextAncestor,
        };
      });

    expect(metrics.documentWidth).toBeLessThanOrEqual(viewport.width);
    expect(metrics.title).not.toBeNull();
    expect(metrics.title!.left).toBeGreaterThanOrEqual(metrics.hero.left - 1);
    expect(metrics.title!.right).toBeLessThanOrEqual(metrics.hero.right + 1);
    expect(metrics.title!.top).toBeGreaterThanOrEqual(metrics.hero.top - 1);
    expect(metrics.title!.bottom).toBeLessThanOrEqual(metrics.hero.bottom + 1);
    expect(metrics.titleCollidesWithGallery).toBe(false);
    expect(metrics.titleCollidesWithLens).toBe(false);
    expect(metrics.translucentTextAncestor).toBe(false);
    expect(metrics.galleryVisible).toBe(viewport.width >= 1280);
  }
});

test("shared page titles keep readable spacing across page types", async ({
  page,
}) => {
  const routes = [
    "/en/portfolio",
    "/fr/process",
    "/en/services/video-production",
    "/fr/portfolio/conference-documentary",
    "/en/thank-you",
  ];

  for (const route of routes) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await waitForHydration(page);
    const metrics = await page.locator("main h1").evaluate((title) => {
      const bounds = title.getBoundingClientRect();
      const style = getComputedStyle(title);
      return {
        bottom: bounds.bottom,
        fontSize: Number.parseFloat(style.fontSize),
        left: bounds.left,
        lineHeight: Number.parseFloat(style.lineHeight),
        right: bounds.right,
        top: bounds.top,
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth,
        pageWidth: document.documentElement.scrollWidth,
      };
    });

    expect(metrics.lineHeight).toBeGreaterThanOrEqual(metrics.fontSize);
    expect(metrics.left).toBeGreaterThanOrEqual(0);
    expect(metrics.right).toBeLessThanOrEqual(metrics.viewportWidth + 1);
    expect(metrics.top).toBeGreaterThanOrEqual(0);
    expect(metrics.bottom).toBeLessThanOrEqual(metrics.viewportHeight + 1);
    expect(metrics.pageWidth).toBeLessThanOrEqual(metrics.viewportWidth);
  }
});

test("language switching keeps the corresponding path and query", async ({
  page,
}) => {
  await page.goto("/fr/portfolio?media=videos&category=event");
  await waitForHydration(page);
  if ((page.viewportSize()?.width ?? 1280) < 1024) {
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  }
  await page
    .getByRole("link", { name: "Afficher cette page en English" })
    .click();
  await expect(page).toHaveURL(/\/en\/portfolio\?media=videos&category=event/);
});

test("portfolio category disclosure is accessible and preserves selection", async ({
  page,
}) => {
  await page.goto("/en/portfolio");
  await waitForHydration(page);

  const trigger = page.locator("[data-portfolio-filter-trigger]");
  const panel = page.locator("#portfolio-category-filters");

  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toHaveAccessibleName("Open category filters");
  await expect(panel).toBeHidden();
  await expect(page.getByRole("button", { name: "Weddings" })).toHaveCount(0);

  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(trigger).toHaveAccessibleName("Close category filters");
  const photoCategories = page.getByRole("group", {
    name: "Filter photo projects",
  });
  await expect(photoCategories).toBeVisible();

  const weddings = photoCategories.getByRole("button", { name: "Weddings" });
  await weddings.click();
  await expect(page).toHaveURL(/category=weddings/);
  await expect(trigger).toContainText("Weddings");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(panel).toBeHidden();
  await expect(trigger).toBeFocused();

  await trigger.click();
  await expect(weddings).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Videos" }).click();
  await expect(page).toHaveURL(/media=videos/);
  expect(new URL(page.url()).searchParams.has("category")).toBe(false);
  const videoCategories = page.getByRole("group", {
    name: "Filter videos by category",
  });
  await expect(videoCategories).toBeVisible();
  await expect(
    videoCategories.getByRole("button", {
      name: "Commercial / Advertising",
    }),
  ).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
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

test("portfolio video filters reproduce the workbook category totals", async ({
  page,
}) => {
  await page.goto("/fr/portfolio");
  await waitForHydration(page);
  await page.getByRole("button", { name: "Vidéos" }).click();
  await expect(page).toHaveURL(/media=videos/);
  await expect(page.locator("article[data-video-id]")).toHaveCount(44);
  await page
    .getByRole("button", { name: "Ouvrir les filtres de catégorie" })
    .click();

  await page.getByRole("button", { name: "Commercial / Publicité" }).click();
  await expect(page).toHaveURL(/category=commercial-advertising/);
  await expect(
    page.getByRole("button", { name: "Ouvrir les filtres de catégorie" }),
  ).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("article[data-video-id]")).toHaveCount(8);
  await expect(
    page.locator('article[data-video-type="long-form"]'),
  ).toHaveCount(1);
  await expect(page.locator('article[data-video-type="short"]')).toHaveCount(7);

  await page
    .getByRole("button", { name: "Ouvrir les filtres de catégorie" })
    .click();
  await page.getByRole("button", { name: "Événement corporate" }).click();
  await expect(page).toHaveURL(/category=corporate-event/);
  await expect(
    page.getByRole("button", { name: "Ouvrir les filtres de catégorie" }),
  ).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("article[data-video-id]")).toHaveCount(11);
});

test("video players are keyboard accessible and load only on activation", async ({
  page,
}) => {
  await page.goto("/en/portfolio?media=videos&category=commercial-advertising");
  await waitForHydration(page);

  await expect(page.locator("iframe[data-video-player]")).toHaveCount(0);
  const playButton = page.getByRole("button", {
    name: "Play video: FILM PUBLICITAIRE - VROOM - by NOM FILMS",
  });
  await playButton.focus();
  await expect(playButton).toBeFocused();
  expect(
    await playButton.evaluate(
      (button) => Number.parseFloat(getComputedStyle(button).outlineWidth) > 0,
    ),
  ).toBe(true);
  await page.keyboard.press("Enter");

  const player = page.locator("iframe[data-video-player]");
  await expect(player).toHaveCount(1);
  await expect(player).toHaveAttribute(
    "title",
    "FILM PUBLICITAIRE - VROOM - by NOM FILMS",
  );
  await expect(player).toHaveAttribute(
    "src",
    /youtube-nocookie\.com\/embed\/AxG6DcoIGfQ\?autoplay=1&rel=0/,
  );
  await expect(page.locator("button[data-video-play]")).toHaveCount(7);
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
  await expect(page.locator("article[data-video-id]")).toHaveCount(44);
});

test("portfolio filters preserve browser history", async ({ page }) => {
  await page.goto("/en/portfolio?media=photos");
  await waitForHydration(page);

  const filterTrigger = page.locator("[data-portfolio-filter-trigger]");
  await filterTrigger.click();
  await page.getByRole("button", { name: "Weddings" }).click();
  await expect(page).toHaveURL(/media=photos.*category=weddings/);
  await page.getByRole("button", { name: "Videos" }).click();
  await expect(page).toHaveURL(/media=videos/);

  await page.goBack();
  await expect(page).toHaveURL(/media=photos.*category=weddings/);
  await expect(page.getByRole("button", { name: "Photos" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(filterTrigger).toContainText("Weddings");

  await page.goBack();
  await expect(page).toHaveURL(/media=photos/);
  expect(new URL(page.url()).searchParams.has("category")).toBe(false);

  await page.goForward();
  await expect(page).toHaveURL(/category=weddings/);
  await page.goForward();
  await expect(page).toHaveURL(/media=videos/);
  await expect(page.locator("article[data-video-id]")).toHaveCount(44);
});

test("portfolio filter surface fits closed and open viewport widths", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name === "mobile",
    "The explicit viewport matrix includes mobile and larger widths",
  );
  test.setTimeout(90_000);

  const viewports = [
    { width: 360, height: 800 },
    { width: 400, height: 800 },
    { width: 768, height: 900 },
    { width: 1024, height: 900 },
    { width: 1440, height: 900 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/en/portfolio?media=videos", {
      waitUntil: "domcontentloaded",
    });
    await waitForHydration(page);

    const surface = page.locator("[data-portfolio-filters]");
    const trigger = page.locator("[data-portfolio-filter-trigger]");
    const readLayout = () =>
      surface.evaluate((filterSurface) => {
        const result = document.querySelector<HTMLElement>(
          "article[data-video-id]",
        );
        if (!result) throw new Error("The first portfolio result is missing");
        const surfaceRect = filterSurface.getBoundingClientRect();
        const resultRect = result.getBoundingClientRect();
        return {
          documentWidth: document.documentElement.scrollWidth,
          surfaceBottom: surfaceRect.bottom,
          surfaceLeft: surfaceRect.left,
          surfaceRight: surfaceRect.right,
          resultTop: resultRect.top,
        };
      });
    const expectLayoutToFit = async () => {
      const layout = await readLayout();
      expect(layout.documentWidth).toBeLessThanOrEqual(viewport.width);
      expect(layout.surfaceLeft).toBeGreaterThanOrEqual(-1);
      expect(layout.surfaceRight).toBeLessThanOrEqual(viewport.width + 1);
      expect(layout.surfaceBottom).toBeLessThanOrEqual(layout.resultTop + 1);
    };

    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expectLayoutToFit();
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expectLayoutToFit();
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expectLayoutToFit();
  }
});

test("video play control keeps the same dark treatment in both themes", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/en/portfolio?media=videos&category=commercial-advertising");
  await waitForHydration(page);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  const control = page.locator("[data-video-play-control]").first();
  const readColors = () =>
    control.evaluate((node) => {
      const style = getComputedStyle(node);
      const toRgba = (color: string) => {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas color context is unavailable");
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
        return Array.from(context.getImageData(0, 0, 1, 1).data);
      };
      const computed = {
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        color: style.color,
      };
      return {
        computed,
        rgba: {
          backgroundColor: toRgba(computed.backgroundColor),
          borderColor: toRgba(computed.borderColor),
          color: toRgba(computed.color),
        },
      };
    });

  const lightColors = await readColors();
  expect(lightColors.rgba.color).toEqual([255, 255, 255, 255]);
  expect(lightColors.rgba.borderColor.slice(0, 3)).toEqual([255, 255, 255]);
  expect(lightColors.rgba.borderColor[3]).toBeCloseTo(255 * 0.75, 0);
  expect(lightColors.rgba.backgroundColor.slice(0, 3)).toEqual([0, 0, 0]);
  expect(lightColors.rgba.backgroundColor[3]).toBeCloseTo(255 * 0.35, 0);

  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await readColors()).toEqual(lightColors);
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

test("theme initializer renders without React script warnings", async ({
  page,
}) => {
  const scriptWarnings: string[] = [];
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      message.text().includes("Encountered a script tag while rendering React")
    ) {
      scriptWarnings.push(message.text());
    }
  });

  await page.goto("/en/journal", { waitUntil: "domcontentloaded" });
  await waitForHydration(page);

  expect(scriptWarnings).toEqual([]);
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
  await expect(dialog).toHaveCount(1);
  expect(
    await page
      .getByRole("main")
      .evaluate((node) => node.closest("[inert]") !== null),
  ).toBe(true);
  const layers = await dialog.evaluate((node) => ({
    backdrop: Number.parseInt(
      getComputedStyle(node.parentElement as HTMLElement).zIndex,
      10,
    ),
    header: Number.parseInt(
      getComputedStyle(document.querySelector("header") as HTMLElement).zIndex,
      10,
    ),
  }));
  expect(layers.backdrop).toBeGreaterThan(layers.header);
  await expect
    .poll(() =>
      dialog.evaluate((node) => node.contains(document.activeElement)),
    )
    .toBe(true);
  await dialog
    .getByRole("heading", { name: /Tell me about your project/ })
    .click();
  await expect(dialog).toBeVisible();
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
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe("");
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

test("homepage and footer Contact links share one popup without navigating", async ({
  page,
}) => {
  await page.goto("/en");
  await waitForHydration(page);
  const triggers = [
    page
      .locator(".reference-home-hero")
      .getByRole("link", { name: "Request a quotation", exact: true }),
    page
      .getByRole("main")
      .getByRole("link", { name: /Tell me about your photography/ }),
    page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Contact", exact: true }),
  ];

  for (const trigger of triggers) {
    const initialUrl = page.url();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveCount(1);
    expect(page.url()).toBe(initialUrl);
    await dialog.getByRole("button", { name: /close/i }).click();
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  }
});

test("modified Contact clicks keep normal browser behavior", async ({
  page,
}) => {
  await page.goto("/en");
  await waitForHydration(page);
  const trigger = page
    .locator(".reference-home-hero")
    .getByRole("link", { name: "Request a quotation", exact: true });
  const notPrevented = await trigger.evaluate((anchor) =>
    anchor.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        button: 0,
        ctrlKey: true,
      }),
    ),
  );
  expect(notPrevented).toBe(true);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("direct Contact fallback renders without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const routes = [
    {
      path: "/en/contact",
      title: "Request a photography or film quotation.",
      emailLabel: /Photography and general enquiries/,
    },
    {
      path: "/fr/contact",
      title: "Demander un devis photo ou vidéo.",
      emailLabel: /Photographie et demandes générales/,
    },
    {
      path: "/ar/contact",
      title: "اطلب عرض سعر للتصوير الفوتوغرافي أو الفيديو.",
      emailLabel: /التصوير الفوتوغرافي والطلبات العامة/,
    },
  ];

  for (const route of routes) {
    const response = await page.goto(route.path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      route.title,
    );
    await expect(
      page.getByRole("link", { name: route.emailLabel }),
    ).toHaveAttribute("href", "mailto:contact@photographefes.com");
  }
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

test("pages do not expose decorative sequence indexes", async ({ page }) => {
  await page.goto("/fr");
  await waitForHydration(page);
  await expect(page.getByText(/^0[1-9]$/)).toHaveCount(0);
  await expect(page.getByText(/01\s*\/\s*Mariages/i)).toHaveCount(0);
  await expect(page.getByText(/02\s*\/\s*Événements/i)).toHaveCount(0);

  if ((page.viewportSize()?.width ?? 1280) < 1024) {
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    await expect(
      page
        .getByRole("navigation", { name: "Navigation mobile" })
        .getByText(/^0[1-9]$/),
    ).toHaveCount(0);
  }

  for (const route of [
    "/en/services",
    "/en/services/wedding-photography",
    "/en/process",
  ]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await waitForHydration(page);
    await expect(page.getByText(/^0[1-9]$/)).toHaveCount(0);
  }

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

test("English pages consistently use the Fez spelling", async ({ page }) => {
  const routes = [
    "/en",
    "/en/portfolio",
    "/en/portfolio?media=videos",
    "/en/services",
    "/en/about",
    "/en/contact",
  ];
  const accentedFez = /F(?:[èé]|e[\u0300\u0301])s/iu;

  for (const route of routes) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await waitForHydration(page);
    const englishSurface = await page.evaluate(() => [
      document.title,
      document.body.innerText,
      ...Array.from(document.querySelectorAll("meta[content]"), (node) =>
        node.getAttribute("content"),
      ),
      ...Array.from(
        document.querySelectorAll("[alt], [title], [aria-label]"),
        (node) =>
          ["alt", "title", "aria-label"]
            .map((attribute) => node.getAttribute(attribute))
            .join(" "),
      ),
      ...Array.from(
        document.querySelectorAll('script[type="application/ld+json"]'),
        (node) => node.textContent,
      ),
    ]);

    expect(englishSurface.join(" ")).not.toMatch(accentedFez);
  }
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
      path: "/en",
      locale: "en",
      h1: "Photographer and filmmaker in Fez.",
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
      page.locator('link[rel="alternate"][hreflang="ar"]'),
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
  for (const path of ["/en/privacy", "/fr/legal", "/en/thank-you"]) {
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
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
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(404);
  }
});
