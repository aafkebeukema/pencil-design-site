import { expect, test } from '@playwright/test';

const basePath = '';
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

test('contact assistant sends the not sure yet starter prompt', async ({ page }) => {
  await page.route('**/api/contact-assistant', async (route) => {
    const body = route.request().postDataJSON();

    expect(body.messages.at(-1)).toEqual({
      role: 'user',
      content: 'I’m not sure yet',
    });

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        reply: 'That is completely fine. Is there a room, problem, or idea you would like help with?',
      }),
    });
  });

  await page.goto(`${basePath}/contact`);
  await page.getByRole('button', { name: 'I’m not sure yet' }).click();

  await expect(page.locator('.message--user .message-bubble').last()).toContainText('I’m not sure yet');
  await expect(page.locator('.message--assistant .message-bubble').last()).toContainText('That is completely fine');
});

test('contact assistant sends manual input and clears the field', async ({ page }) => {
  await page.route('**/api/contact-assistant', async (route) => {
    const body = route.request().postDataJSON();

    expect(body.messages.at(-1)).toEqual({
      role: 'user',
      content: 'We are thinking about built-in storage in Dulwich.',
    });

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        reply: 'Thanks. Which area or postcode area is the property in?',
      }),
    });
  });

  await page.goto(`${basePath}/contact`);

  const input = page.locator('#chat-input');

  await input.fill('We are thinking about built-in storage in Dulwich.');
  await page.locator('#chat-send').click();

  await expect(input).toHaveValue('');
  await expect(page.locator('.message--user .message-bubble').last()).toContainText('built-in storage');
  await expect(page.locator('.message--assistant .message-bubble').last()).toContainText('Which area');
});

test('contact assistant shows loading state while waiting', async ({ page }) => {
  let finishResponse;
  const responseReady = new Promise((resolve) => {
    finishResponse = resolve;
  });

  await page.route('**/api/contact-assistant', async (route) => {
    await responseReady;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        reply: 'Thanks. What sort of timeline do you have in mind?',
      }),
    });
  });

  await page.goto(`${basePath}/contact`);
  await page.getByRole('button', { name: 'I’m planning a renovation' }).click();

  await expect(page.locator('.message--thinking')).toBeVisible();
  const thinkingIconBox = await page.locator('.message--thinking .message-avatar .spark-icon').boundingBox();
  expect(thinkingIconBox?.width).toBeLessThanOrEqual(20);
  await expect(page.locator('#chat-input')).toBeDisabled();
  await expect(page.locator('#chat-send')).toBeDisabled();
  await expect(page.getByRole('button', { name: 'I’m not sure yet' })).toBeDisabled();

  finishResponse();

  await expect(page.locator('.message--thinking')).toHaveCount(0);
  await expect(page.locator('#chat-input')).toBeEnabled();
});

test('contact assistant shows a calm error state', async ({ page }) => {
  await page.route('**/api/contact-assistant', async (route) => {
    await route.fulfill({
      status: 502,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'Temporary issue',
      }),
    });
  });

  await page.goto(`${basePath}/contact`);
  await page.getByRole('button', { name: 'I need help with a kitchen or bathroom' }).click();

  await expect(page.locator('#chat-status .chat-status-message')).toContainText('having trouble replying');
  await expect(page.locator('.message--error')).toHaveCount(0);
  await expect(page.locator('#chat-input')).toBeEnabled();
  await expect(page.locator('#chat-send')).toBeEnabled();
});

test('contact assistant explains when the backend is not configured', async ({ page }) => {
  await page.route('**/api/contact-assistant', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'The assistant is not configured yet.',
      }),
    });
  });

  await page.goto(`${basePath}/contact`);
  await page.getByRole('button', { name: 'I’m not sure yet' }).click();

  await expect(page.locator('#chat-status .chat-status-message')).toContainText(
    'not configured in this environment',
  );
  await expect(page.locator('#chat-input')).toBeEnabled();
  await expect(page.locator('#chat-send')).toBeEnabled();
});
