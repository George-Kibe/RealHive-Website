import { connectDB } from "@/db/connectDB";
import User from "@/models/UserModel";
import { NextResponse } from "next/server";
import { sendPasswordResetSuccessEmail } from "@/lib/emails";

// request passowrd reset
export const POST = async (request) => {
    const {email, otp, password} = await request.json();
    if (!email || !otp ||!password) {
        return new NextResponse("Some fields are missing", {status: 422});
    }
    await connectDB(); 
    try {
        const user = await User.findOne({
            resetPasswordOTP: otp,
            resetPasswordOTPExpiresAt: {$gt: Date.now()}
        });
        if (!user) {
            return NextResponse.json(
                {message: "Invalid or expired OTP", success: false},
                {status: 404}
            );
        }
        user.password = password;
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpiresAt = undefined;
        await user.save();
        // send password reset success email
        await sendPasswordResetSuccessEmail(user.email, user.username)
        return NextResponse.json(
            { message: "Passoword reset successfully",
              success: true,
            },
            { status: 200 }
        )
    } catch (error) {
        return new NextResponse(error.message, {status: 500,})
    }
}
