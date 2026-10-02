import mongoose from "mongoose";
import { connectDB } from "@/db/connectDB";
import { getAdmin } from "@/lib/adminAuth";
import { cancelBooking } from "@/lib/booking/actions";
import Booking from "@/models/BookingModel";
import { NextResponse } from "next/server";

// cancel a booking from the admin calendar (admin only); the visitor is emailed
export const POST = async (request, { params }) => {
    if (!(await getAdmin())) return new NextResponse("Unauthorized", {status: 401});
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return new NextResponse("Booking not found", {status: 404});
    await connectDB();
    try {
        const booking = await Booking.findById(id);
        if (!booking) return new NextResponse("Booking not found", {status: 404});
        const cancelled = await cancelBooking(booking, "admin");
        if (!cancelled) return new NextResponse("This booking is already cancelled or has passed", {status: 409});
        return NextResponse.json({ message: 'Booking cancelled; the visitor has been emailed', success: true }, { status: 200 });
    } catch (error) {
        return new NextResponse(error.message, {status: 500});
    }
}
