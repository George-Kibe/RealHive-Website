import jwt from "jsonwebtoken";
import { cookies, headers } from "next/headers";
import { connectDB } from "@/db/connectDB";
import User from "@/models/UserModel";

/**
 * Website session for signed-in users (e.g. blog commenters).
 *
 * The browser gets an httpOnly cookie, so the token is never readable from page
 * JavaScript. API clients that already use the mobile-style Bearer access
 * token (/api/auth/login) are accepted too.
 *
 * This is separate from the admin session in adminAuth.js: signing in here
 * never grants access to /admin.
 */

export const SESSION_COOKIE = "realhive_session";
export const SESSION_SECONDS = 30 * 24 * 60 * 60; // 30 days

export const signSession = (userId) =>
    jwt.sign({ userId, scope: "user" }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: SESSION_SECONDS,
    });

export const sessionCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
};

const userIdFromToken = (token, scope) => {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // session cookies carry scope "user"; mobile access tokens carry no scope
        if (scope ? decoded.scope !== scope : decoded.scope) return null;
        return decoded.userId;
    } catch {
        return null;
    }
};

// returns the signed-in, verified user for the current request, or null
export const getSessionUser = async () => {
    let userId = null;
    const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
    if (cookie) userId = userIdFromToken(cookie, "user");
    if (!userId) {
        const bearer = (await headers()).get("authorization");
        if (bearer?.startsWith("Bearer ")) userId = userIdFromToken(bearer.slice(7), null);
    }
    if (!userId) return null;
    await connectDB();
    const user = await User.findById(userId).select("username email role isVerified").lean();
    return user?.isVerified ? user : null;
};
