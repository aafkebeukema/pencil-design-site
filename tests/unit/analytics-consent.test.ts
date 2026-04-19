import { describe, expect, test } from 'vitest';

import {
  ANALYTICS_CONSENT_COOKIE,
  buildClearedConsentCookie,
  buildConsentCookie,
  getCookieValue,
  hasAcceptedAnalytics,
  hasStoredAnalyticsConsent,
} from '../../src/lib/analytics-consent';

describe('analytics consent helpers', () => {
  test('reads a cookie value by name', () => {
    const value = getCookieValue(
      `${ANALYTICS_CONSENT_COOKIE}=accepted; other_cookie=123`,
      ANALYTICS_CONSENT_COOKIE,
    );

    expect(value).toBe('accepted');
  });

  test('builds a consent cookie with the provided path', () => {
    const cookie = buildConsentCookie('accepted', '/pencil-design-site/');

    expect(cookie).toContain(`${ANALYTICS_CONSENT_COOKIE}=accepted`);
    expect(cookie).toContain('Path=/pencil-design-site/');
    expect(cookie).toContain('SameSite=Lax');
  });

  test('builds a clearing cookie for resetting consent', () => {
    const cookie = buildClearedConsentCookie('/pencil-design-site/');

    expect(cookie).toContain(`${ANALYTICS_CONSENT_COOKIE}=`);
    expect(cookie).toContain('Max-Age=0');
  });

  test('distinguishes accepted consent from stored rejection', () => {
    const accepted = `${ANALYTICS_CONSENT_COOKIE}=accepted`;
    const rejected = `${ANALYTICS_CONSENT_COOKIE}=rejected`;

    expect(hasStoredAnalyticsConsent(accepted)).toBe(true);
    expect(hasStoredAnalyticsConsent(rejected)).toBe(true);
    expect(hasAcceptedAnalytics(accepted)).toBe(true);
    expect(hasAcceptedAnalytics(rejected)).toBe(false);
  });
});
