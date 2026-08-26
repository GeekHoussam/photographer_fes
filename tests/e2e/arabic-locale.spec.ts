import { expect, test } from "@playwright/test";

async function waitForHydration(page: import("@playwright/test").Page) {
  await page.locator('html[data-hydrated="true"]').waitFor();
}

const projectSlugs = [
  "weddings-in-fes",
  "conference-documentary",
  "moroccan-interiors",
  "culinary-stories",
] as const;

const serviceSlugs = [
  "wedding-photography",
  "event-photography",
  "corporate-photography",
  "product-photography",
  "food-photography",
  "hospitality-photography",
  "portrait-photography",
  "video-production",
] as const;

const articleSlugs = [
  "photographe-mariage-fes",
  "photographe-evenementiel-fes",
  "photographe-reseaux-sociaux-fes",
] as const;

const arabicRoutes = [
  "/ar",
  "/ar/portfolio",
  "/ar/portfolio?media=videos",
  ...projectSlugs.map((slug) => `/ar/portfolio/${slug}`),
  "/ar/services",
  ...serviceSlugs.map((slug) => `/ar/services/${slug}`),
  "/ar/about",
  "/ar/process",
  "/ar/journal",
  ...articleSlugs.map((slug) => `/ar/journal/${slug}`),
  "/ar/contact",
  "/ar/privacy",
  "/ar/legal",
  "/ar/thank-you",
] as const;

test("every Arabic route renders localized RTL content and reciprocal SEO", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name === "mobile",
    "The route crawl is viewport-independent",
  );
  test.setTimeout(180_000);

  for (const route of arabicRoutes) {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status(), route).toBe(200);
    await waitForHydration(page);

    await expect(page.locator("html"), route).toHaveAttribute("lang", "ar");
    await expect(page.locator("html"), route).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("heading", { level: 1 }), route).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 }), route).toContainText(
      /[\u0600-\u06ff]/,
    );
    await expect(
      page.locator('link[rel="alternate"][hreflang="fr"]'),
      route,
    ).toHaveCount(1);
    await expect(
      page.locator('link[rel="alternate"][hreflang="en"]'),
      route,
    ).toHaveCount(1);
    await expect(
      page.locator('link[rel="alternate"][hreflang="ar"]'),
      route,
    ).toHaveCount(1);
    await expect(
      page.locator('link[rel="alternate"][hreflang="x-default"]'),
      route,
    ).toHaveCount(1);

    const diagnostics = await page.evaluate(() => ({
      body: document.body.innerText,
      fits: document.documentElement.scrollWidth <= window.innerWidth,
      fontFamily: getComputedStyle(document.body).fontFamily,
    }));
    expect(diagnostics.fits, route).toBe(true);
    expect(diagnostics.body, route).not.toMatch(
      /Navigation\.|Portfolio\.|Common\.|Footer\.|Contact\./,
    );
    expect(diagnostics.fontFamily, route).toMatch(/Arabic/i);
  }
});

test("representative Arabic pages fit four viewport widths in both themes", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name === "mobile",
    "This test supplies its own viewport matrix",
  );
  test.setTimeout(180_000);

  const routes = [
    "/ar",
    "/ar/portfolio?media=videos",
    "/ar/services/wedding-photography",
    "/ar/journal/photographe-mariage-fes",
    "/ar/contact",
  ];
  const viewports = [
    { width: 390, height: 844 },
    { width: 768, height: 900 },
    { width: 1024, height: 900 },
    { width: 1440, height: 1000 },
  ];

  for (const theme of ["dark", "light"] as const) {
    await page.goto("/ar", { waitUntil: "domcontentloaded" });
    await page.evaluate(
      (nextTheme) => localStorage.setItem("photographer-theme", nextTheme),
      theme,
    );
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      for (const route of routes) {
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await waitForHydration(page);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        const layout = await page.evaluate(() => {
          const heading = document.querySelector<HTMLElement>("main h1");
          if (!heading) throw new Error("Arabic page heading is missing");
          const bounds = heading.getBoundingClientRect();
          return {
            fits: document.documentElement.scrollWidth <= window.innerWidth,
            headingLeft: bounds.left,
            headingRight: bounds.right,
            viewportWidth: window.innerWidth,
          };
        });
        expect(layout.fits, `${theme} ${viewport.width}px ${route}`).toBe(true);
        expect(layout.headingLeft, route).toBeGreaterThanOrEqual(-1);
        expect(layout.headingRight, route).toBeLessThanOrEqual(
          layout.viewportWidth + 1,
        );
      }
    }
  }
});

test("Arabic language choices preserve the current route and query", async ({
  page,
}) => {
  await page.goto("/ar/portfolio?media=videos&category=corporate-event");
  await waitForHydration(page);
  if ((page.viewportSize()?.width ?? 1280) < 640) {
    await page.getByRole("button", { name: "فتح القائمة" }).click();
  }

  const switcher = page.getByRole("navigation", { name: "اختيار اللغة" });
  await expect(switcher.getByRole("link")).toHaveCount(3);
  await expect(
    switcher.getByRole("link", { name: "عرض هذه الصفحة باللغة العربية" }),
  ).toHaveAttribute("aria-current", "page");
  await switcher
    .getByRole("link", { name: "عرض هذه الصفحة باللغة English" })
    .click();
  await expect(page).toHaveURL(
    /\/en\/portfolio\?media=videos&category=corporate-event/,
  );
});

test("Arabic portfolio filters, video activation, and contact validation work", async ({
  page,
}) => {
  await page.goto("/ar/portfolio?media=videos");
  await waitForHydration(page);

  const trigger = page.locator("[data-portfolio-filter-trigger]");
  await expect(trigger).toHaveAccessibleName("فتح عوامل تصفية الفئات");
  await trigger.click();
  const categories = page.getByRole("group", {
    name: "تصفية الفيديوهات حسب الفئة",
  });
  await categories.getByRole("button", { name: "فعالية للشركات" }).click();
  await expect(page).toHaveURL(/category=corporate-event/);
  await expect(page.locator("article[data-video-id]")).toHaveCount(11);

  const play = page.locator("button[data-video-play]").first();
  await expect(play).toHaveAccessibleName(/^تشغيل الفيديو:/);
  await play.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("iframe[data-video-player]")).toHaveCount(1);

  await page.goto("/ar/contact");
  await waitForHydration(page);
  const main = page.getByRole("main");
  await main.getByRole("button", { name: "إرسال الطلب" }).click();
  await expect(main.getByRole("alert").first()).toHaveText(
    "يرجى التحقق من هذا الحقل.",
  );
});

test("Arabic contact dialog and RTL lightbox navigation retain accessibility behavior", async ({
  page,
}, testInfo) => {
  await page.goto("/ar");
  await waitForHydration(page);
  const mobile = (page.viewportSize()?.width ?? 1280) < 1024;
  if (mobile) {
    await page.getByRole("button", { name: "فتح القائمة" }).click();
  }
  await page
    .getByRole(mobile ? "navigation" : "banner", {
      name: mobile ? "التنقل على الهاتف" : undefined,
    })
    .getByRole("link", { name: "تواصل", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: /حدّثني عن مشروعك/ });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  await page.goto("/ar/portfolio/weddings-in-fes");
  await waitForHydration(page);
  await page
    .getByRole("button", { name: /^تكبير:/ })
    .first()
    .click();
  const gallery = page.getByRole("dialog", { name: "معرض بملء الشاشة" });
  const firstAlt = await gallery.locator("img").getAttribute("alt");
  if (testInfo.project.name === "mobile") {
    await gallery.getByRole("button", { name: "الصورة التالية" }).click();
  } else {
    await page.keyboard.press("ArrowLeft");
  }
  await expect
    .poll(() => gallery.locator("img").getAttribute("alt"))
    .not.toBe(firstAlt);
  await expect(
    gallery.getByRole("button", { name: "الصورة السابقة" }),
  ).toBeVisible();
  await expect(
    gallery.getByRole("button", { name: "الصورة التالية" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(gallery).toBeHidden();
});
