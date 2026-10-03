"use client"

import { useEffect } from "react";
import Script from "next/script";
import { CONSENT_KEY, CONSENT_REQUIRED_COUNTRIES, GA_MEASUREMENT_ID, trackEvent } from "@/lib/analytics";

/**
 * Loads GA4 with Consent Mode v2 defaults set BEFORE the config call:
 * analytics denied in the consent-required regions (until the banner is
 * accepted), granted elsewhere; ads always denied. A choice saved earlier is
 * re-applied straight away so returning visitors aren't asked again.
 *
 * Also tracks clicks on email, phone and WhatsApp links anywhere on the site
 * (one delegated listener instead of wiring every link).
 */
const initScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', region: ${JSON.stringify(CONSENT_REQUIRED_COUNTRIES)}, wait_for_update: 500 });
try { var c = localStorage.getItem(${JSON.stringify(CONSENT_KEY)}); if (c === 'granted' || c === 'denied') gtag('consent', 'update', { analytics_storage: c }); } catch (e) {}
gtag('js', new Date());
gtag('config', ${JSON.stringify(GA_MEASUREMENT_ID)});
`;

const contactMethod = (href) => {
  if (href.startsWith("mailto:")) return "email";
  if (href.startsWith("tel:")) return "phone";
  if (/^https?:\/\/(wa\.me|wa\.link|api\.whatsapp\.com)\//i.test(href)) return "whatsapp";
  return null;
};

const GoogleAnalytics = () => {
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return undefined;
    const onClick = (event) => {
      const link = event.target.closest?.("a[href]");
      const method = link && contactMethod(link.getAttribute("href") ?? "");
      if (method) trackEvent("contact_click", { method, page_path: window.location.pathname });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!GA_MEASUREMENT_ID) return null;
  return (
    <>
      <Script id="ga-init" strategy="afterInteractive">{initScript}</Script>
      <Script id="ga-gtag" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
    </>
  );
};

export default GoogleAnalytics;
