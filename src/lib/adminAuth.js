import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/db/connectDB";
import User, { ROLES } from "@/models/UserModel";

/**
 * Admin dashboard session.
 *
 * The admin login sets a short-lived JWT in an httpOnly cookie so the token is
 * never readable from page JavaScript. Pages and API routes call getAdmin(),
 * which re-checks the user's role in the database on every request, so
 * removing someone's admin role takes effect immediately.
 *
 * A user is an admin when their role is ROLES.ADMIN ("Admin"); every user
 * defaults to ROLES.USER ("User"). Create one with `npm run create-admin`.
 */

export const ADMIN_COOKIE = "realhive_admin";
export const ADMIN_SESSION_SECONDS = 8 * 60 * 60; // 8 hours

export const signAdminSession = (userId) =>
    jwt.sign({ userId, scope: "admin" }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: ADMIN_SESSION_SECONDS,
    });

export const adminCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS,
};

// returns the admin user for the current request, or null
export const getAdmin = async () => {
    const token = (await cookies()).get(ADMIN_COOKIE)?.value;
    if (!token) return null;
    try {
        const { userId, scope } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (scope !== "admin") return null;
        await connectDB();
        const user = await User.findById(userId).select("email username role").lean();
        return user?.role === ROLES.ADMIN ? user : null;
    } catch {
        return null;
    }
};
