"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { buttonVariants } from "@/components/ui/button";

const BookingCard = ({ booking, onCancel, busy }) => (
  <li className="rounded-lg p-4 ring-1 ring-border">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="font-semibold">{booking.when}</p>
        {booking.visitorWhen && <p className="text-xs text-muted-foreground">Their time: {booking.visitorWhen}</p>}
        <p className="mt-1 text-sm">
          {booking.name}{booking.company && <span className="text-muted-foreground"> · {booking.company}</span>}
          {" · "}<a href={`mailto:${booking.email}`} className="text-brand hover:underline">{booking.email}</a>
        </p>
        <p className="text-xs text-muted-foreground">{booking.reference}{booking.status === "cancelled" && ` · cancelled by ${booking.cancelledBy}`}</p>
      </div>
      {onCancel && (
        <div className="flex flex-wrap gap-2">
          <a href={booking.calendarLink} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "brand", size: "sm" })}>
            Create in Google Calendar
          </a>
          <button type="button" disabled={busy} onClick={() => onCancel(booking)} className={buttonVariants({ variant: "outline", size: "sm" })}>
            {busy ? "Cancelling…" : "Cancel"}
          </button>
        </div>
      )}
    </div>
    <p className="mt-3 whitespace-pre-line rounded bg-muted p-2 text-sm">{booking.topic}</p>
  </li>
);

// Upcoming bookings (with Google Calendar + cancel) and the last 30 days of past/cancelled ones.
const AdminBookings = ({ upcoming, recent }) => {
  const router = useRouter();
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState("");

  const cancel = async (booking) => {
    if (!window.confirm(`Cancel ${booking.name}'s consultation on ${booking.when}? They'll be emailed.`)) return;
    setBusyId(booking._id);
    setMessage("");
    try {
      await axios.post(`/api/admin/bookings/${booking._id}/cancel`);
      setMessage(`Cancelled. ${booking.name} has been emailed.`);
      router.refresh();
    } catch (error) {
      setMessage(typeof error.response?.data === "string" ? error.response.data : "Couldn't cancel the booking.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="mt-8" aria-labelledby="upcoming-heading">
      <h2 id="upcoming-heading" className="text-lg font-semibold">Upcoming consultations ({upcoming.length})</h2>
      {message && <p role="status" className="mt-2 text-sm">{message}</p>}
      {upcoming.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No upcoming consultations.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {upcoming.map((b) => <BookingCard key={b._id} booking={b} onCancel={cancel} busy={busyId === b._id} />)}
        </ul>
      )}
      {recent.length > 0 && (
        <details className="mt-6">
          <summary className="cursor-pointer text-sm font-medium">Past and cancelled (last 30 days, {recent.length})</summary>
          <ul className="mt-4 space-y-4 opacity-80">
            {recent.map((b) => <BookingCard key={b._id} booking={b} />)}
          </ul>
        </details>
      )}
    </section>
  );
};

export default AdminBookings;
