import { connectDB } from "@/db/connectDB";
import User from "@/models/UserModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// get profile of the current user
export const GET = async (request) => {
    const bearerHeader = request.headers.get('authorization');
    let userId;
    // console.log("Bearer header: ", bearerHeader);
    if (typeof bearerHeader !== 'undefined') {
        try {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            const decoded = jwt.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET)
            userId = decoded.userId;
        } catch (error) {
            return new NextResponse("Invalid or expired Token", {status: 401})
        }
    } else {
        return new NextResponse("Unauthorized", {status: 401})
    }
    
    await connectDB();
    try {
        const user = await User.findById(userId).select("-password");
        if (!user) {
            // Return a 404 response if user is not found
            return NextResponse.json({ message: "Invalid or expired token. User not found" }, { status: 404 });
        }
        return NextResponse.json(
            { message: 'User found',
              success: true, 
              user
            },
            {status: 200}
        )
    } catch (error) {
        return new NextResponse(error.message, {status: 500,})
    }
}
