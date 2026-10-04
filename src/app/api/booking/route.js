import { createBooking } from "@/lib/booking/actions";
import { BookingInputError } from "@/lib/booking/server";
import { NextResponse } from "next/server";

// book a consultation: { startsAt, name, email, company?, topic, timezone? }
export const POST = async (request) => {
    try {
        const { booking, emailed } = await createBooking(await request.json().catch(() => ({})));
        return NextResponse.json(
            { message: 'Consultation booked', success: true, emailed,
              booking: { reference: booking.reference, startsAt: booking.startsAt, endsAt: booking.endsAt, meetLink: booking.meetLink ?? null } },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof BookingInputError) return new NextResponse(error.message, {status: error.status ?? 422});
        return new NextResponse("We couldn't book that time. Please try again.", {status: 500});
    }
}
