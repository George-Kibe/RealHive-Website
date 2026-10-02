import { ADMIN_COOKIE, adminCookieOptions } from "@/lib/adminAuth";
import { NextResponse } from "next/server";

// log the admin out (clears the session cookie)
export const POST = async () => {
    const response = NextResponse.json(
        { message: 'Logged out successfully', success: true },
        { status: 200 }
    );
    response.cookies.set(ADMIN_COOKIE, "", { ...adminCookieOptions, maxAge: 0 });
    return response;
}
