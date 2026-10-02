import { v2 as cloudinary } from "cloudinary";
import { getAdmin } from "@/lib/adminAuth";
import { NextResponse } from "next/server";

// sign a Cloudinary upload for the admin upload widget (reads credentials from CLOUDINARY_URL)
export const POST = async (request) => {
    if (!(await getAdmin())) {
        return new NextResponse("Unauthorized", {status: 401});
    }
    const {paramsToSign} = await request.json();
    if (!paramsToSign || typeof paramsToSign !== "object") {
        return new NextResponse("paramsToSign is required", {status: 422});
    }
    const signature = cloudinary.utils.api_sign_request(paramsToSign, cloudinary.config().api_secret);
    return NextResponse.json({ signature }, { status: 200 });
}
