import Link from "next/link";
import { findBookingByToken } from "@/lib/booking/actions";
import { formatRange } from "@/lib/booking/time";
import CancelBookingButton from "@/components/booking/CancelBookingButton";
import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Cancel your consultation" };

// Opened from the link in the visitor's confirmation email (?token=…).
export default async function CancelBookingPage({ searchParams }) {
  const { token } = await searchParams;
  const booking = await findBookingByToken(token);
  const over = booking && booking.endsAt <= new Date();

  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Cancel your consultation</h1>
      {!booking ? (
        <p className="mt-4 text-sm text-muted-foreground">We couldn&apos;t find this booking. The link may be incomplete: please use the one in your confirmation email.</p>
      ) : booking.status === "cancelled" ? (
        <p className="mt-4 text-sm">This consultation ({booking.reference}) is already cancelled.</p>
      ) : over ? (
        <p className="mt-4 text-sm">This consultation ({booking.reference}) has already taken place.</p>
      ) : (
        <>
          <p className="mt-4 text-sm">
            <span className="font-semibold">{formatRange(booking.startsAt, booking.endsAt, booking.timezone)}</span>
            <span className="block text-muted-foreground">{booking.timezone} · reference {booking.reference}</span>
          </p>
          <CancelBookingButton token={token} />
        </>
      )}
      <Link href="/book" className={buttonVariants({ variant: "link", className: "mt-6 px-0" })}>Book another time</Link>
    </>
  );
}
