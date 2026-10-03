"use client"

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { buttonVariants } from "@/components/ui/button";
import { BUILD_LEVELS, SERVICES } from "@/lib/quote/catalog";
import { formatMoney } from "@/lib/quote/format";
import { trackEvent } from "@/lib/analytics";
import { normalizeSelection } from "@/lib/quote/selection";

/**
 * The quote builder. It holds no prices: every figure comes from
 * /api/quote/estimate, which prices on the server for the visitor's IP location
 * and returns final local amounts only, so nothing on the page (or in its
 * JavaScript) reveals how prices are set.
 */

const inputClass =
  "mt-1 w-full rounded-md border-0 bg-muted text-foreground placeholder:text-muted-foreground px-3.5 py-2 shadow-xs ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6";

// Sensible starting choices when a service is ticked, so it prices immediately.
const defaultsFor = (service) => {
  const sel = {};
  for (const field of service.fields) {
    if (field.type === "single") sel[field.key] = field.required ? field.options[0].id : undefined;
    else if (field.key === "platforms") sel[field.key] = field.options.map((o) => o.id); // Android + iOS
    else sel[field.key] = field.required ? [field.options[0].id] : [];
  }
  return sel;
};

const errorMessage = (error, fallback) => {
  const data = error.response?.data;
  return typeof data === "string" && data ? data : fallback;
};

const ESTIMATE_DEBOUNCE_MS = 250;

const Choice = ({ type, name, checked, onChange, label, hint }) => (
  <label className={`flex cursor-pointer items-start gap-3 rounded-lg p-3 text-sm ring-1 transition-colors ${checked ? "bg-brand/10 ring-brand" : "ring-border hover:bg-muted"}`}>
    <input type={type} name={name} checked={checked} onChange={onChange} className="mt-0.5 h-4 w-4 shrink-0 accent-brand" />
    <span>
      <span className="font-medium">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>}
    </span>
  </label>
);

const QuoteBuilder = () => {
  const [buildLevel, setBuildLevel] = useState("mvp");
  const [services, setServices] = useState({});
  const [contact, setContact] = useState({ name: "", email: "", company: "", notes: "" });
  const [busy, setBusy] = useState(null); // "pdf" | "email"
  const [sentTo, setSentTo] = useState(null);
  // the last estimate from the server, tagged with the selection it was for
  const [estimate, setEstimate] = useState({ key: null, quote: null, failed: false });

  const { errors } = useMemo(() => normalizeSelection({ buildLevel, services }), [buildLevel, services]);
  const hasServices = Object.keys(services).length > 0;
  const selectionKey = JSON.stringify({ buildLevel, services });
  const valid = hasServices && errors.length === 0;

  // Fetch the estimate (debounced) whenever the selection changes.
  useEffect(() => {
    if (!valid) return undefined;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      axios.post("/api/quote/estimate", { selection: JSON.parse(selectionKey) }, { signal: controller.signal })
        .then((res) => setEstimate({ key: selectionKey, quote: res.data.quote, failed: false }))
        .catch((error) => {
          if (!axios.isCancel(error)) setEstimate({ key: selectionKey, quote: null, failed: true });
        });
    }, ESTIMATE_DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [selectionKey, valid]);

  const current = valid && estimate.key === selectionKey ? estimate : null;
  // keep showing the previous figures (dimmed) while a new estimate loads
  const quote = valid ? (current?.quote ?? estimate.quote) : null;
  const updating = valid && !current;
  const money = (amount) => formatMoney(amount, quote?.currency);
  const itemFor = (id) => quote?.items.find((i) => i.serviceId === id);

  const toggleService = (service) =>
    setServices((prev) => {
      const next = { ...prev };
      if (next[service.id]) delete next[service.id];
      else next[service.id] = defaultsFor(service);
      return next;
    });

  const setField = (serviceId, field, optionId) =>
    setServices((prev) => {
      const currentValue = prev[serviceId][field.key];
      const value = field.type === "single"
        ? optionId
        : currentValue.includes(optionId) ? currentValue.filter((id) => id !== optionId) : [...currentValue, optionId];
      return { ...prev, [serviceId]: { ...prev[serviceId], [field.key]: value } };
    });

  const payload = () => ({ selection: { buildLevel, services }, contact });
  // what was quoted, for analytics: services and amounts, never contact details
  const quoteParams = () => ({
    services: Object.keys(services).join(","),
    build_level: buildLevel,
    ...(current?.quote ? { value: current.quote.projectFrom, currency: current.quote.currency } : {}),
  });

  const download = async () => {
    setBusy("pdf");
    try {
      const res = await axios.post("/api/quote/pdf", payload(), { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = /filename="([^"]+)"/.exec(res.headers["content-disposition"] ?? "")?.[1] ?? "RealHive-estimate.pdf";
      link.click();
      URL.revokeObjectURL(url);
      trackEvent("quote_downloaded", quoteParams());
    } catch (error) {
      // blob responses carry the error text as a Blob
      const text = error.response?.data instanceof Blob ? await error.response.data.text() : "";
      toast.error(text || "Couldn't create the PDF. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  const email = async (e) => {
    e.preventDefault();
    setBusy("email");
    try {
      const res = await axios.post("/api/quote/email", payload());
      setSentTo({ email: contact.email, reference: res.data.reference });
      trackEvent("quote_emailed", quoteParams());
      toast.success(`Quote sent to ${contact.email}`);
    } catch (error) {
      toast.error(errorMessage(error, "Couldn't send the quote. Please try again or download the PDF."));
    } finally {
      setBusy(null);
    }
  };

  const ready = valid && Boolean(current?.quote);

  return (
    <div className="mx-auto mt-12 max-w-4xl space-y-12">
      <ToastContainer />

      {/* 1. Build level */}
      <section aria-labelledby="q-level">
        <h2 id="q-level" className="text-xl font-bold"><span className="text-brand">1.</span> How far should we take it?</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {Object.entries(BUILD_LEVELS).map(([id, level]) => (
            <Choice key={id} type="radio" name="build-level" checked={buildLevel === id} onChange={() => setBuildLevel(id)}
              label={level.label} hint={level.description} />
          ))}
        </div>
      </section>

      {/* 2. Services */}
      <section aria-labelledby="q-services">
        <h2 id="q-services" className="text-xl font-bold"><span className="text-brand">2.</span> What do you need?</h2>
        <p className="mt-1 text-sm text-muted-foreground">Pick as many as you like.</p>
        <div className="mt-4 space-y-4">
          {SERVICES.map((service) => {
            const sel = services[service.id];
            const item = sel ? itemFor(service.id) : null;
            return (
              <div key={service.id} className={`rounded-xl ring-1 ${sel ? "ring-brand" : "ring-border"}`}>
                <label className="flex cursor-pointer items-start justify-between gap-4 p-4">
                  <span className="flex items-start gap-3">
                    <input type="checkbox" checked={Boolean(sel)} onChange={() => toggleService(service)} className="mt-1 h-4 w-4 accent-brand" />
                    <span>
                      <span className="block font-semibold">{service.name}</span>
                      <span className="block text-sm text-muted-foreground">{service.summary}</span>
                    </span>
                  </span>
                  {item && (
                    <span className={`shrink-0 text-right text-sm transition-opacity ${updating ? "opacity-50" : ""}`}>
                      <span className="block text-xs text-muted-foreground">from</span>
                      <span className="font-semibold">{money(item.from)}{item.monthly && <span className="font-normal text-muted-foreground"> /mo</span>}</span>
                    </span>
                  )}
                </label>
                {sel && (
                  <div className="space-y-5 border-t border-border p-4">
                    {service.fields.map((field) => (
                      <fieldset key={field.key}>
                        <legend className="text-sm font-medium">
                          {field.label}
                          {field.type === "multi" && <span className="font-normal text-muted-foreground"> (choose any)</span>}
                        </legend>
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          {field.options.map((option) => (
                            <Choice
                              key={option.id}
                              type={field.type === "single" ? "radio" : "checkbox"}
                              name={`${service.id}-${field.key}`}
                              checked={field.type === "single" ? sel[field.key] === option.id : sel[field.key].includes(option.id)}
                              onChange={() => setField(service.id, field, option.id)}
                              label={option.label}
                              hint={option.hint}
                            />
                          ))}
                        </div>
                      </fieldset>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Estimate */}
      <section id="estimate" aria-labelledby="q-estimate" className="scroll-mt-8">
        <h2 id="q-estimate" className="text-xl font-bold"><span className="text-brand">3.</span> Your estimate</h2>
        <div className="mt-4 rounded-xl p-5 ring-1 ring-border sm:p-6" aria-live="polite" aria-busy={updating}>
          {!hasServices ? (
            <p className="text-sm text-muted-foreground">Choose at least one service above to see your estimate.</p>
          ) : errors.length > 0 ? (
            <p role="alert" className="text-sm text-destructive">{errors[0]}</p>
          ) : current?.failed ? (
            <p role="alert" className="text-sm text-destructive">We couldn&apos;t calculate your estimate right now. Please try again in a moment.</p>
          ) : !quote ? (
            <p className="text-sm text-muted-foreground">Calculating…</p>
          ) : (
            <div className={`transition-opacity ${updating ? "opacity-50" : ""}`}>
              <ul className="divide-y divide-border">
                {quote.items.map((item) => (
                  <li key={item.serviceId} className="flex items-start justify-between gap-4 py-3">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.details && <p className="text-xs text-muted-foreground">{item.details}</p>}
                    </div>
                    <p className="shrink-0 text-right text-sm">from <span className="font-semibold">{money(item.from)}</span>{item.monthly && " / month"}</p>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-2 rounded-lg bg-muted p-4">
                {quote.projectFrom > 0 && (
                  <div className="flex items-baseline justify-between gap-4">
                    <dt>Estimated project investment</dt>
                    <dd className="text-xl font-bold text-brand">from {money(quote.projectFrom)}</dd>
                  </div>
                )}
                {quote.monthlyFrom > 0 && (
                  <div className="flex items-baseline justify-between gap-4 text-sm">
                    <dt>Ongoing support</dt>
                    <dd className="font-semibold">from {money(quote.monthlyFrom)} / month</dd>
                  </div>
                )}
                {quote.weeksFrom > 0 && (
                  <div className="flex items-baseline justify-between gap-4 text-sm">
                    <dt>Typical timeline</dt>
                    <dd className="font-semibold">from {quote.weeksFrom} weeks</dd>
                  </div>
                )}
              </dl>
              <p className="mt-3 text-xs text-muted-foreground">
                {quote.buildLevelLabel} · indicative &ldquo;starting from&rdquo; prices in {quote.currency}, not a fixed quote: the final price is agreed after a free discovery call.
                {quote.currency !== "USD" && (
                  <> Converted at today&apos;s exchange rate (<a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer" className="underline">Rates By Exchange Rate API</a>).</>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Get it */}
        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
          <form onSubmit={email} className="rounded-xl p-5 ring-1 ring-border sm:p-6">
            <h3 className="font-semibold">Email me the PDF</h3>
            {sentTo ? (
              <p className="mt-2 text-sm" role="status">
                Sent to <span className="font-semibold">{sentTo.email}</span> (reference {sentTo.reference}). We&apos;ll be in touch about a discovery call.
              </p>
            ) : (
              <>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="q-name" className="block text-sm font-medium">Name *</label>
                    <input id="q-name" required maxLength={100} autoComplete="name" value={contact.name}
                      onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="q-email" className="block text-sm font-medium">Email *</label>
                    <input id="q-email" type="email" required maxLength={200} autoComplete="email" value={contact.email}
                      onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="q-company" className="block text-sm font-medium">Company</label>
                    <input id="q-company" maxLength={100} autoComplete="organization" value={contact.company}
                      onChange={(e) => setContact((c) => ({ ...c, company: e.target.value }))} className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="q-notes" className="block text-sm font-medium">Anything else we should know?</label>
                    <textarea id="q-notes" rows={3} maxLength={1000} value={contact.notes}
                      onChange={(e) => setContact((c) => ({ ...c, notes: e.target.value }))} className={inputClass} />
                  </div>
                </div>
                <button type="submit" disabled={!ready || busy !== null} className={buttonVariants({ variant: "brand", className: "mt-4" })}>
                  {busy === "email" ? "Sending…" : "Email me the quote"}
                </button>
              </>
            )}
          </form>
          <div className="rounded-xl p-5 ring-1 ring-border sm:p-6">
            <h3 className="font-semibold">Or download it</h3>
            <p className="mt-1 text-sm text-muted-foreground">No details needed.</p>
            <button type="button" onClick={download} disabled={!ready || busy !== null} className={buttonVariants({ variant: "brandOutline", className: "mt-4" })}>
              {busy === "pdf" ? "Preparing…" : "Download PDF"}
            </button>
          </div>
        </div>
      </section>

      {/* Running total, always in view (position: fixed works despite the root <main> clipping overflow) */}
      {quote && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur">
          <div className={`mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 transition-opacity ${updating ? "opacity-60" : ""}`}>
            <p className="text-sm">
              <span className="text-muted-foreground">Starting from </span>
              {quote.projectFrom > 0 && <span className="text-lg font-bold text-brand">{money(quote.projectFrom)}</span>}
              {quote.projectFrom > 0 && quote.monthlyFrom > 0 && <span className="text-muted-foreground"> + </span>}
              {quote.monthlyFrom > 0 && (
                <span className={quote.projectFrom > 0 ? "text-muted-foreground" : "text-lg font-bold text-brand"}>
                  {money(quote.monthlyFrom)}/mo
                </span>
              )}
            </p>
            <a href="#estimate" className={buttonVariants({ variant: "brand", size: "sm" })}>See estimate</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteBuilder;
