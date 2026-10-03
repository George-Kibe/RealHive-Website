"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { buttonVariants } from "@/components/ui/button";
import { GA_MEASUREMENT_ID, OPEN_CONSENT_EVENT, setAnalyticsConsent, storedConsent } from "@/lib/analytics";

/**
 * Asks for analytics consent, only where the law requires it (EEA, UK,
 * Switzerland; see /api/consent-region) and only until the visitor chooses.
 * "Cookie settings" in the footer reopens it so a choice can be changed.
 * Nothing renders when GA isn't configured.
 */
const ConsentBanner = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return undefined;
    let cancelled = false;
    if (!storedConsent()) {
      axios.get("/api/consent-region")
        .then((res) => { if (!cancelled && res.data.required) setOpen(true); })
        .catch(() => { if (!cancelled) setOpen(true); });
    }
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => {
      cancelled = true;
      window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
    };
  }, []);

  if (!open) return null;

  const choose = (granted) => {
    setAnalyticsConsent(granted);
    setOpen(false);
  };

  return (
    <div role="dialog" aria-modal="false" aria-labelledby="consent-title"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-4 shadow-lg backdrop-blur sm:inset-x-auto sm:bottom-4 sm:right-4 sm:max-w-md sm:rounded-xl sm:border">
      <p id="consent-title" className="font-semibold">Analytics cookies</p>
      <p className="mt-1 text-sm text-muted-foreground">
        We&apos;d like to use Google Analytics cookies to see how visitors use this site, so we can improve it. No advertising.
        {" "}<Link href="/privacy-policy#cookies" className="underline">Privacy policy</Link>
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => choose(true)} className={buttonVariants({ variant: "brand", size: "sm" })}>Accept</button>
        <button type="button" onClick={() => choose(false)} className={buttonVariants({ variant: "outline", size: "sm" })}>Decline</button>
      </div>
    </div>
  );
};

export default ConsentBanner;
