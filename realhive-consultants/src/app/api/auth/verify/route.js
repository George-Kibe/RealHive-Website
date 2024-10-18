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
        verificationToken: code, 
        verificationTokenExpiresAt: {$gt: Date.now()}});
    if (!user) {
        return res.status(404).json({
            message: "Invalid or expired token", 
            success: false
        });
    }
    try {
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        //send welcome email
        await sendWelcomeEmail(user.email, user.username);

        return NextResponse.json(
            { message: 'User verified successfully',
              success: true,
              user: {
                ...savedUser._doc,
                password: undefined,
            }},
            { status: 201 }
        )
    } catch (error) {
        return new NextResponse.json(error.message, {status: 500,})
    }
}
