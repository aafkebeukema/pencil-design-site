export const ANALYTICS_CONSENT_COOKIE = 'pencil_analytics_consent';
export const ANALYTICS_CONSENT_MAX_AGE = 60 * 60 * 24 * 180;

export type AnalyticsConsent = 'accepted' | 'rejected';

export function getCookieValue(cookieString: string, name: string) {
  const cookies = cookieString.split(';').map((entry) => entry.trim());
  const match = cookies.find((entry) => entry.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

export function buildConsentCookie(value: AnalyticsConsent, path: string) {
  return `${ANALYTICS_CONSENT_COOKIE}=${value}; Max-Age=${ANALYTICS_CONSENT_MAX_AGE}; Path=${path}; SameSite=Lax`;
}

export function buildClearedConsentCookie(path: string) {
  return `${ANALYTICS_CONSENT_COOKIE}=; Max-Age=0; Path=${path}; SameSite=Lax`;
}

export function hasStoredAnalyticsConsent(cookieString: string) {
  const value = getCookieValue(cookieString, ANALYTICS_CONSENT_COOKIE);
  return value === 'accepted' || value === 'rejected';
}

export function hasAcceptedAnalytics(cookieString: string) {
  return getCookieValue(cookieString, ANALYTICS_CONSENT_COOKIE) === 'accepted';
}
