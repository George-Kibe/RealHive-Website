import { connectDB } from "@/db/connectDB";
import Subscriber from "@/models/SubscriberModel";
import { NextResponse } from "next/server";

// unsubscribe an email from the newsletter (deletes the subscriber)
export const DELETE = async (request, { params }) => {
    const { email } = await params;
    let normalizedEmail;
    try {
        normalizedEmail = decodeURIComponent(email).trim().toLowerCase();
    } catch {
        normalizedEmail = email?.trim().toLowerCase();
    }
    if (!normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
        return new NextResponse("Please enter a valid email", {status: 422})
    }
    await connectDB();
    try {
        const subscriber = await Subscriber.findOneAndDelete({email: normalizedEmail});
        if (!subscriber) {
            return new NextResponse("Subscriber not found", {status: 404})
        }
        return NextResponse.json(
            { message: 'Unsubscribed successfully', success: true },
            { status: 200 }
        )
    } catch (error) {
        return new NextResponse(error.message, {status: 500})
    }
}
