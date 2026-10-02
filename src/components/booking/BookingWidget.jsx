"use client"

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import axios from "axios";
import { buttonVariants } from "@/components/ui/button";

const inputClass =
  "mt-1 w-full rounded-md border-0 bg-muted text-foreground placeholder:text-muted-foreground px-3.5 py-2 shadow-xs ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6";

// The visitor's own time zone; everything on this page is shown in it. Read via
// useSyncExternalStore with a null server snapshot: the server doesn't know the
// visitor's zone, so rendering it during SSR would cause a hydration mismatch.
const visitorTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
};
const subscribeNoop = () => () => {};
const useVisitorTimeZone = () => useSyncExternalStore(subscribeNoop, visitorTimeZone, () => null);

const dayKey = (date, timeZone) =>
  new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
const fmt = (date, timeZone, options) => new Intl.DateTimeFormat(undefined, { timeZone, ...options }).format(date);

const errorText = (error, fallback) => {
  const data = error.response?.data;
  return typeof data === "string" && data ? data : fallback;
};

/**
 * Pick a day, pick a time, add details, book. Rendered entirely in the browser
 * (slots are fetched after mount), so times are always in the visitor's zone.
 */
const BookingWidget = () => {
  const detectedZone = useVisitorTimeZone();
  const hydrated = detectedZone !== null;
  const timeZone = detectedZone ?? "UTC";
  const [state, setState] = useState({ status: "loading", slots: [], slotMinutes: 30 });
  const [day, setDay] = useState(null);
  const [slot, setSlot] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", topic: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [booked, setBooked] = useState(null);

  const loadSlots = useCallback(async () => {
    try {
      const res = await axios.get("/api/booking/slots");
      setState({ status: "ready", slots: res.data.slots.map((s) => new Date(s)), slotMinutes: res.data.slotMinutes });
    } catch {
      setState((prev) => ({ ...prev, status: "error" }));
    }
  }, []);

  useEffect(() => {
    // fetch after mount: a subscription to external data, not derived state
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSlots();
  }, [loadSlots]);

  // { "2026-10-05": [Date, …], … } in the visitor's time zone
  const byDay = useMemo(() => {
    const groups = new Map();
    for (const s of state.slots) {
      const key = dayKey(s, timeZone);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(s);
    }
    return groups;
  }, [state.slots, timeZone]);
  const days = [...byDay.keys()];
  const selectedDay = day && byDay.has(day) ? day : days[0] ?? null;

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await axios.post("/api/booking", { ...form, startsAt: slot.toISOString(), timezone: timeZone });
      setBooked({ ...res.data.booking, emailed: res.data.emailed });
    } catch (err) {
      setError(errorText(err, "We couldn't book that time. Please try again."));
      if (err.response?.status === 409) {
        // the slot was taken meanwhile: refresh the list and ask for another time
        setSlot(null);
        loadSlots();
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (booked) {
    const start = new Date(booked.startsAt);
    const end = new Date(booked.endsAt);
    return (
      <div role="status" className="mx-auto mt-12 max-w-xl rounded-xl p-6 text-center ring-1 ring-brand">
        <h2 className="text-2xl font-bold">You&apos;re booked in</h2>
        <p className="mt-3 text-lg font-semibold">
          {fmt(start, timeZone, { weekday: "long", day: "numeric", month: "long" })}, {fmt(start, timeZone, { hour: "2-digit", minute: "2-digit" })}–{fmt(end, timeZone, { hour: "2-digit", minute: "2-digit" })}
        </p>
        <p className="text-sm text-muted-foreground">{timeZone} · reference {booked.reference}</p>
        <p className="mt-4 text-sm">
          {booked.emailed
            ? <>We&apos;ve emailed a confirmation to <span className="font-semibold">{form.email}</span>, with a calendar invite. We&apos;ll send the Google Meet link before the call.</>
            : <>We&apos;ve got your booking, but the confirmation email didn&apos;t go out. We&apos;ll be in touch at {form.email} with the Google Meet link.</>}
        </p>
        <Link href="/" className={buttonVariants({ variant: "brandOutline", className: "mt-6" })}>Back to the homepage</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-12 max-w-4xl">
      <p className="text-center text-sm text-muted-foreground">
        {state.slotMinutes}-minute video call (Google Meet){hydrated && <> · times shown in your time zone ({timeZone})</>}
      </p>

      {state.status === "loading" && <p className="mt-10 text-center text-muted-foreground">Loading available times…</p>}
      {state.status === "error" && (
        <p role="alert" className="mt-10 text-center text-destructive">
          We couldn&apos;t load available times. Please refresh the page, or <Link href="/contacts" className="underline">contact us</Link>.
        </p>
      )}
      {state.status === "ready" && days.length === 0 && (
        <p className="mt-10 text-center text-muted-foreground">
          There are no free times right now. Please <Link href="/contacts" className="underline">contact us</Link> and we&apos;ll arrange a call.
        </p>
      )}

      {state.status === "ready" && days.length > 0 && (
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_1fr]">
          <section aria-labelledby="b-day">
            <h2 id="b-day" className="text-lg font-bold"><span className="text-brand">1.</span> Pick a day</h2>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {days.map((key) => {
                const first = byDay.get(key)[0];
                const active = key === selectedDay;
                return (
                  <button key={key} type="button" aria-pressed={active} onClick={() => { setDay(key); setSlot(null); setError(""); }}
                    className={`rounded-lg px-2 py-2 text-center text-sm ring-1 transition-colors ${active ? "bg-brand text-brand-foreground ring-brand" : "ring-border hover:bg-muted"}`}>
                    <span className="block text-xs">{fmt(first, timeZone, { weekday: "short" })}</span>
                    <span className="block font-semibold">{fmt(first, timeZone, { day: "numeric", month: "short" })}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="b-time">
            <h2 id="b-time" className="text-lg font-bold"><span className="text-brand">2.</span> Pick a time</h2>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {(byDay.get(selectedDay) ?? []).map((s) => {
                const active = slot?.getTime() === s.getTime();
                return (
                  <button key={s.toISOString()} type="button" aria-pressed={active} onClick={() => { setSlot(s); setError(""); }}
                    className={`rounded-lg px-2 py-2 text-sm font-medium ring-1 transition-colors ${active ? "bg-brand text-brand-foreground ring-brand" : "ring-border hover:bg-muted"}`}>
                    {fmt(s, timeZone, { hour: "2-digit", minute: "2-digit" })}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {error && <p role="alert" className="mt-6 text-center text-sm text-destructive">{error}</p>}

      {slot && (
        <form onSubmit={submit} className="mt-10 rounded-xl p-5 ring-1 ring-brand sm:p-6">
          <h2 className="text-lg font-bold"><span className="text-brand">3.</span> Your details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {fmt(slot, timeZone, { weekday: "long", day: "numeric", month: "long" })} at {fmt(slot, timeZone, { hour: "2-digit", minute: "2-digit" })} ({timeZone})
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="b-name" className="block text-sm font-medium">Name *</label>
              <input id="b-name" required maxLength={100} autoComplete="name" value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label htmlFor="b-email" className="block text-sm font-medium">Email *</label>
              <input id="b-email" type="email" required maxLength={200} autoComplete="email" value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="b-company" className="block text-sm font-medium">Company</label>
              <input id="b-company" maxLength={100} autoComplete="organization" value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="b-topic" className="block text-sm font-medium">What would you like to discuss? *</label>
              <textarea id="b-topic" required rows={4} maxLength={1000} value={form.topic}
                onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))} className={inputClass}
                placeholder="A sentence or two about your project helps us prepare." />
            </div>
          </div>
          <button type="submit" disabled={submitting} className={buttonVariants({ variant: "brand", className: "mt-4" })}>
            {submitting ? "Booking…" : "Book consultation"}
          </button>
        </form>
      )}
    </div>
  );
};

export default BookingWidget;
