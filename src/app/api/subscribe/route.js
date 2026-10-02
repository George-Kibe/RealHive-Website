import { connectDB } from "@/db/connectDB";
import Subscriber from "@/models/SubscriberModel";
import { NextResponse } from "next/server";

// subscribe an email to the newsletter
export const POST = async (request) => {
    const {email} = await request.json();
    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
        return new NextResponse("Please enter a valid email", {status: 422})
    }
    await connectDB();
    try {
        const existing = await Subscriber.findOne({email: normalizedEmail});
        if (existing?.isActive) {
            return new NextResponse("You are already subscribed", {status: 409})
        }
        if (existing) {
            // re-subscribe a previously unsubscribed email
            existing.isActive = true;
            existing.unsubscribedAt = undefined;
            await existing.save();
            return NextResponse.json(
                { message: 'Subscribed successfully', success: true },
                { status: 200 }
            )
        }
        await Subscriber.create({email: normalizedEmail});
        return NextResponse.json(
            { message: 'Subscribed successfully', success: true },
            { status: 201 }
        )
    } catch (error) {
        return new NextResponse(error.message, {status: 500})
    }
}
