import { connectDB } from "@/db/connectDB";
import { generateVerificationCode } from "@/lib/generateTokens";
import User from "@/models/UserModel";
import { NextResponse } from "next/server";
import { sendResetPasswordMobileEmail } from "@/lib/emails";

// request passowrd reset
export const POST = async (request) => {
    const {email} = await request.json();
    if (!email) {
        return new NextResponse("Email is required", {status: 422});
    }
    await connectDB(); 
    try {
        const user = await User.findOne({email});
        if (!user) {
            return NextResponse.json({message: "User not found"}, {status: 404});
        }
        const otpCode = generateVerificationCode();
        user.resetPasswordOTP = otpCode;
        user.resetPasswordOTPExpiresAt = Date.now() + 10 * 60 * 1000; // ten minues
        await user.save();
        //send password reset email
        await sendResetPasswordMobileEmail(user.email, otpCode);
        return NextResponse.json(
            { message: "Reset password email sent",
                success: true,
            },
            { status: 200 }
        )
    } catch (error) {
        return new NextResponse(error.message, {status: 500,})
    }
}
