/**
 * Google Analytics 4 helpers. Client-safe.
 *
 * GA only loads when NEXT_PUBLIC_GA_MEASUREMENT_ID is set (inlined at build
 * time, so changing it needs a redeploy). It runs in Consent Mode v2: in the
 * regions below analytics cookies stay off until the visitor accepts the
 * banner; elsewhere they're on by default and the banner isn't shown. Ad
 * storage is always denied: the site runs no ads.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

// Where consent is required before analytics cookies: the EEA, the UK and
// Switzerland (GDPR / UK GDPR / revFADP). ISO 3166-1 alpha-2 codes.
export const CONSENT_REQUIRED_COUNTRIES = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV",
  "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", // EU
  "IS", "LI", "NO", // rest of the EEA
  "GB", "CH",
];

// The visitor's stored choice ("granted" | "denied"), kept in localStorage.
export const CONSENT_KEY = "realhive-analytics-consent";
// Fired by the footer's "Cookie settings" link to reopen the banner.
export const OPEN_CONSENT_EVENT = "realhive:open-consent";

/**
 * Send a GA4 event. A no-op when GA isn't configured or hasn't loaded, so it's
 * safe to call anywhere. Never pass personal data (names, emails, phone
 * numbers): Google's terms forbid it.
 */
export function trackEvent(name, params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

export function setAnalyticsConsent(granted) {
  try {
    localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
  } catch {
    // storage blocked: the choice still applies to this page view
  }
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", { analytics_storage: granted ? "granted" : "denied" });
  }
}

export function storedConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}
