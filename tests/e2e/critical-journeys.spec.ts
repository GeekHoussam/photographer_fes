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
      name: mobile ? "Mobile navigation" : "Primary navigation",
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
      page.getByRole("link", { name: /View portfolio/i }).first(),
    ).toBeVisible();
    return;
  }

  await expect(trigger).toBeVisible();
  await expect(trigger).toHaveAccessibleName("Show gallery");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(trigger).toHaveAccessibleName("Hide gallery");
  await expect(
    page.locator('.hero-orbit-card[aria-label="Public presence"]'),
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
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("alert").first()).toBeVisible();
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
  await page.getByLabel("Name").fill("Example Person");
  await page.getByLabel("Email").fill("person@example.com");
  await page.getByLabel("Location").fill("Fès");
  await page
    .getByLabel("Your message")
    .fill("A complete demonstration enquiry for browser testing.");
  await page.getByLabel(/I agree/).check();
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("status")).toContainText("Thank you");
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
