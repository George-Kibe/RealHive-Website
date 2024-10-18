import { connectDB } from "@/db/connectDB";
import { generateAccessToken, generateRefreshToken } from "@/lib/generateTokens";
import User from "@/models/UserModel";
import { NextResponse } from "next/server";

// login a user
export const POST = async (request) => {
    const {username, email, password} = await request.json();
    if ((!email && !username) || !password) {
        return new NextResponse("Please enter all fields", {status: 422});
    }    
    await connectDB();    
    try {
        const user = await User.findOne({
            $or: [
              { email: email }, 
              { username: email }
            ]
          });
        if (!user) {
            return new NextResponse('User not found', { status: 401 });
        }
        if (!user.isVerified) {
            return new NextResponse('Please verify your email to login', { status: 401 });
        }
        
        if(user && (await user.matchPassword(password))){
            // update last login
            user.lastLogin = new Date();
            await user.save();
            // access and refresh tokens
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            return NextResponse.json(
                { message: 'User Logged in successfully', 
                  success: true,
                  accessToken, refreshToken,
                  user: {
                    ...user._doc,
                    password: undefined,
                }},
                { status: 200 }
            )
        }else{
            return new NextResponse('Invalid email or password', { status: 401 });
        }
    } catch (error) {
        return new NextResponse(error.message, {status: 500,})
    }
}
