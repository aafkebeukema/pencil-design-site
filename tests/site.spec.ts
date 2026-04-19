import { expect, test } from '@playwright/test';

test('mobile menu opens and closes on small screens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const toggle = page.locator('.menu-toggle');
  const nav = page.locator('#site-nav');

  await expect(toggle).toHaveAttribute('aria-label', 'Open menu');
  await toggle.click();

  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveAttribute('aria-label', 'Close menu');
  await expect(nav).toHaveClass(/is-open/);

  await nav.getByRole('link', { name: 'Contact', exact: true }).click();

  await expect(page).toHaveURL(/\/contact\/?$/);
  await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
});

test('services page CTA routes to the contact page', async ({ page }) => {
  await page.goto('/services');

  await page.getByRole('link', { name: 'Get in touch' }).click();

  await expect(page).toHaveURL(/\/contact\/?$/);
  await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
});

test('desktop navigation includes a home link back to the homepage', async ({ page }) => {
  await page.goto('/projects');

  await page.locator('#site-nav').getByRole('link', { name: 'Home', exact: true }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: /Not your average/i })).toBeVisible();
});
