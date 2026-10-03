"use client"

import { GA_MEASUREMENT_ID, OPEN_CONSENT_EVENT } from "@/lib/analytics";

// Footer link that reopens the analytics consent banner (only when GA is configured).
const CookieSettingsButton = ({ className = "" }) => {
  if (!GA_MEASUREMENT_ID) return null;
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))} className={className}>
      Cookie settings
    </button>
  );
};

export default CookieSettingsButton;
