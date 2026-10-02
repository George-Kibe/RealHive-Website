import { connectDB } from "@/db/connectDB";
import { getSessionUser, sessionCookieOptions, SESSION_COOKIE, signSession } from "@/lib/session";
import User from "@/models/UserModel";
import { NextResponse } from "next/server";

// get the signed-in website user (or null)
export const GET = async () => {
    const user = await getSessionUser();
    return NextResponse.json(
        { success: true, user: user ? { _id: user._id.toString(), username: user.username, role: user.role } : null },
        { status: 200, headers: { "Cache-Control": "no-store" } }
    );
}

// sign in to the website (sets an httpOnly session cookie)
export const POST = async (request) => {
    const {email, password} = await request.json();
    if (!email || !password) {
        return new NextResponse("Please enter all fields", {status: 422});
    }
    await connectDB();
    try {
        const user = await User.findOne({email: email.trim()});
        if (!user || !(await user.matchPassword(password))) {
            return new NextResponse("Invalid email or password", {status: 401});
        }
        if (!user.isVerified) {
            return new NextResponse("Please verify your email to sign in", {status: 403});
        }
        user.lastLogin = new Date();
        await user.save();

        const response = NextResponse.json(
            { message: 'Signed in successfully', success: true,
              user: { _id: user._id.toString(), username: user.username, role: user.role } },
            { status: 200 }
        );
        response.cookies.set(SESSION_COOKIE, signSession(user._id.toString()), sessionCookieOptions);
        return response;
    } catch (error) {
        return new NextResponse(error.message, {status: 500});
    }
}

// sign out (clears the session cookie)
export const DELETE = async () => {
    const response = NextResponse.json({ message: 'Signed out successfully', success: true }, { status: 200 });
    response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
    return response;
}
