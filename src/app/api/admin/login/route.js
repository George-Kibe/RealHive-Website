import { connectDB } from "@/db/connectDB";
import { ADMIN_COOKIE, adminCookieOptions, signAdminSession } from "@/lib/adminAuth";
import User, { ROLES } from "@/models/UserModel";
import { NextResponse } from "next/server";

// log an admin into the dashboard (sets an httpOnly session cookie)
export const POST = async (request) => {
    const {email, password} = await request.json();
    if (!email || !password) {
        return new NextResponse("Please enter all fields", {status: 422});
    }
    await connectDB();
    try {
        const user = await User.findOne({email: email.trim()});
        // same response for every failure so the form doesn't reveal which accounts exist or are admins
        if (!user || user.role !== ROLES.ADMIN || !user.isVerified || !(await user.matchPassword(password))) {
            return new NextResponse("Invalid email or password", {status: 401});
        }
        user.lastLogin = new Date();
        await user.save();

        const response = NextResponse.json(
            { message: 'Logged in successfully', success: true },
            { status: 200 }
        );
        response.cookies.set(ADMIN_COOKIE, signAdminSession(user._id.toString()), adminCookieOptions);
        return response;
    } catch (error) {
        return new NextResponse(error.message, {status: 500});
    }
}
