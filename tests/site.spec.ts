import { expect, test } from '@playwright/test';

const basePath = '/pencil-design-site';
const gaMeasurementId = 'G-TEST123456';

test('cookie banner reject keeps analytics off and stays hidden on reload', async ({ page }) => {
  await page.goto(`${basePath}/`);

  const banner = page.locator('[data-cookie-banner]');

  await expect(banner).toBeVisible();
  await page.getByRole('button', { name: 'Reject' }).click();
  await expect(banner).toBeHidden();
  await expect
    .poll(() => page.evaluate(() => document.cookie))
    .toContain('pencil_analytics_consent=rejected');
  await expect(page.locator(`script[src*="${gaMeasurementId}"]`)).toHaveCount(0);
  expect(await page.evaluate(() => window.__pencilAnalyticsLoaded === true)).toBe(false);

  await page.reload();
  await expect(banner).toBeHidden();
});

test('cookie banner accept enables analytics consent and loads the GA script', async ({ page }) => {
  await page.goto(`${basePath}/`);

  const banner = page.locator('[data-cookie-banner]');

  await expect(banner).toBeVisible();
  await page.getByRole('button', { name: 'Accept' }).click();
  await expect(banner).toBeHidden();
  await expect
    .poll(() => page.evaluate(() => document.cookie))
    .toContain('pencil_analytics_consent=accepted');
  expect(await page.evaluate(() => window.__pencilAnalyticsLoaded === true)).toBe(true);
  await expect(page.locator(`script[src*="${gaMeasurementId}"]`)).toHaveCount(1);

  await page.reload();
  await expect(banner).toBeHidden();
  expect(await page.evaluate(() => window.__pencilAnalyticsLoaded === true)).toBe(true);
});

test('mobile menu opens and closes on small screens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${basePath}/`);

  const toggle = page.locator('.menu-toggle');
  const nav = page.locator('#site-nav');

  await expect(toggle).toHaveAttribute('aria-label', 'Open menu');
  await toggle.click();

  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveAttribute('aria-label', 'Close menu');
  await expect(nav).toHaveClass(/is-open/);

  await nav.getByRole('link', { name: 'Contact', exact: true }).click();

  await expect(page).toHaveURL(new RegExp(`${basePath}/contact/?$`));
  await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
});

test('services page CTA routes to the contact page', async ({ page }) => {
  await page.goto(`${basePath}/services`);

  await page.getByRole('link', { name: 'Get in touch' }).click();

  await expect(page).toHaveURL(new RegExp(`${basePath}/contact/?$`));
  await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
});

test('desktop navigation includes a home link back to the homepage', async ({ page }) => {
  await page.goto(`${basePath}/projects`);

  await page.locator('#site-nav').getByRole('link', { name: 'Home', exact: true }).click();

  await expect(page).toHaveURL(new RegExp(`${basePath}/?$`));
  await expect(page.getByRole('heading', { name: /Not your average/i })).toBeVisible();
});
