import { cancelBooking, findBookingByToken } from "@/lib/booking/actions";
import { NextResponse } from "next/server";

// cancel a booking from the link in the visitor's confirmation email: { token }
export const POST = async (request) => {
    const { token } = await request.json().catch(() => ({}));
    try {
        const booking = await findBookingByToken(token);
        if (!booking) return new NextResponse("Booking not found", {status: 404});
        const cancelled = await cancelBooking(booking, "visitor");
        if (!cancelled) return new NextResponse("This booking is already cancelled or has passed", {status: 409});
        return NextResponse.json({ message: 'Booking cancelled', success: true }, { status: 200 });
    } catch (error) {
        return new NextResponse("Couldn't cancel the booking. Please try again.", {status: 500});
    }
}
