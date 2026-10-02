import { connectDB } from "@/db/connectDB";
import { sendWelcomeEmail } from "@/lib/emails";
import User from "@/models/UserModel";
import { NextResponse } from "next/server";

// verify your Email
export const POST = async (request) => {
    const {code, email} = await request.json();
    if (!email || !code) {
        return new NextResponse("Please enter all fields", {status: 422})
    }
    await connectDB();
    const user = await User.findOne({
        email,
        verificationToken: code, 
        verificationTokenExpiresAt: {$gt: Date.now()}}).select("-password");
    if (!user) {
        return NextResponse.json(
            { message: 'Invalid or expired Token. No user Found', 
              success: false
            },
            { status: 404 }
        )
    }
    try {
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        // send welcome email; the account is already verified, so a mail failure shouldn't fail the request
        try {
            await sendWelcomeEmail(user.email, user.username);
        } catch (error) {
            console.error("Welcome email failed: ", error.message);
        }

        return NextResponse.json(
            { message: 'User verified successfully',
              success: true,
              user
            },
            { status: 200 }
        )
    } catch (error) {
        return new NextResponse(error.message, {status: 500,})
    }
}
