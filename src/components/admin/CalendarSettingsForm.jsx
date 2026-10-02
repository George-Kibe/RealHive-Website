"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { buttonVariants } from "@/components/ui/button";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONDAY_FIRST = [1, 2, 3, 4, 5, 6, 0];

const inputClass =
  "rounded-md border-0 bg-muted px-3 py-1.5 text-foreground shadow-xs ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm";

// Working hours per weekday, call length, notice, booking window and blocked days.
const CalendarSettingsForm = ({ initial, slotLengths }) => {
  const router = useRouter();
  const [settings, setSettings] = useState(initial);
  const [newBlock, setNewBlock] = useState({ date: "", reason: "" });
  const [saving, setSaving] = useState(false);

  const setDay = (day, patch) =>
    setSettings((s) => ({ ...s, weekly: s.weekly.map((w) => (w.day === day ? { ...w, ...patch } : w)) }));

  const addBlock = () => {
    if (!newBlock.date) return;
    setSettings((s) => ({
      ...s,
      blockedDates: [...s.blockedDates.filter((b) => b.date !== newBlock.date), { date: newBlock.date, reason: newBlock.reason.trim() }]
        .sort((a, b) => a.date.localeCompare(b.date)),
    }));
    setNewBlock({ date: "", reason: "" });
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put("/api/admin/calendar", settings);
      setSettings(res.data.settings);
      toast.success("Calendar saved");
      router.refresh();
    } catch (error) {
      toast.error(typeof error.response?.data === "string" ? error.response.data : "Couldn't save the calendar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="mt-12 border-t border-border pt-8">
      <ToastContainer />
      <h2 className="text-lg font-semibold">Availability</h2>
      <p className="mt-1 text-sm text-muted-foreground">Times are in {settings.timezone}. Visitors see them converted to their own time zone.</p>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium">Working hours</legend>
        <div className="mt-2 space-y-2">
          {MONDAY_FIRST.map((day) => {
            const w = settings.weekly.find((x) => x.day === day);
            return (
              <div key={day} className="flex flex-wrap items-center gap-3 rounded-lg p-2 ring-1 ring-border">
                <label className="flex w-36 items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={w.enabled} onChange={(e) => setDay(day, { enabled: e.target.checked })} className="h-4 w-4 accent-brand" />
                  {WEEKDAYS[day]}
                </label>
                {w.enabled ? (
                  <span className="flex items-center gap-2 text-sm">
                    <input type="time" aria-label={`${WEEKDAYS[day]} start`} value={w.start} step={900} required
                      onChange={(e) => setDay(day, { start: e.target.value })} className={inputClass} />
                    to
                    <input type="time" aria-label={`${WEEKDAYS[day]} end`} value={w.end} step={900} required
                      onChange={(e) => setDay(day, { end: e.target.value })} className={inputClass} />
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">Unavailable</span>
                )}
              </div>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-medium">
          Call length
          <select value={settings.slotMinutes} onChange={(e) => setSettings((s) => ({ ...s, slotMinutes: Number(e.target.value) }))}
            className={`mt-1 block w-full ${inputClass}`}>
            {slotLengths.map((m) => <option key={m} value={m}>{m} minutes</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">
          Minimum notice (hours)
          <input type="number" min={0} max={168} value={settings.minNoticeHours}
            onChange={(e) => setSettings((s) => ({ ...s, minNoticeHours: Number(e.target.value) }))} className={`mt-1 block w-full ${inputClass}`} />
        </label>
        <label className="text-sm font-medium">
          Bookable up to (days ahead)
          <input type="number" min={1} max={90} value={settings.horizonDays}
            onChange={(e) => setSettings((s) => ({ ...s, horizonDays: Number(e.target.value) }))} className={`mt-1 block w-full ${inputClass}`} />
        </label>
      </div>

      <fieldset className="mt-8">
        <legend className="text-sm font-medium">Blocked days (holidays, time off)</legend>
        <div className="mt-2 flex flex-wrap items-end gap-2">
          <input type="date" aria-label="Date to block" value={newBlock.date} onChange={(e) => setNewBlock((b) => ({ ...b, date: e.target.value }))} className={inputClass} />
          <input type="text" aria-label="Reason (optional)" placeholder="Reason (optional)" maxLength={100} value={newBlock.reason}
            onChange={(e) => setNewBlock((b) => ({ ...b, reason: e.target.value }))} className={inputClass} />
          <button type="button" onClick={addBlock} disabled={!newBlock.date} className={buttonVariants({ variant: "outline", size: "sm" })}>Block day</button>
        </div>
        {settings.blockedDates.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {settings.blockedDates.map((b) => (
              <li key={b.date} className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm ring-1 ring-border">
                {b.date}{b.reason && <span className="text-muted-foreground">· {b.reason}</span>}
                <button type="button" aria-label={`Unblock ${b.date}`}
                  onClick={() => setSettings((s) => ({ ...s, blockedDates: s.blockedDates.filter((x) => x.date !== b.date) }))}
                  className="text-muted-foreground hover:text-destructive">×</button>
              </li>
            ))}
          </ul>
        )}
      </fieldset>

      <button type="submit" disabled={saving} className={buttonVariants({ variant: "brand", className: "mt-8" })}>
        {saving ? "Saving…" : "Save availability"}
      </button>
    </form>
  );
};

export default CalendarSettingsForm;
