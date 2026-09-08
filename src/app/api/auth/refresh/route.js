import { connectDB } from "@/db/connectDB";
import { generateAccessToken } from "@/lib/generateTokens";
import User from "@/models/UserModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// refresh access token
export const POST = async (request) => {
    const {refreshToken} = await request.json();
    if (!refreshToken) {
        return new NextResponse("Please enter all fields", {status: 422});
    }
    await connectDB(); 
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({ message: "Invalid or expired token. User not found" }, { status: 404 })
        }
        const accessToken = generateAccessToken(user._id);
        return NextResponse.json(
            { message: "Access token generated successfully",
                success: true,
                accessToken
            },
            { status: 200 }
        )
    } catch (error) {
        return new NextResponse(error.message, {status: 500,})
    }
}
