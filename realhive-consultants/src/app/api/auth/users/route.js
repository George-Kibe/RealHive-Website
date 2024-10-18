import { connectDB } from "@/db/connectDB";
import { sendVerificationEmail } from "@/lib/emails";
import { generateVerificationCode } from "@/lib/generateTokens";
import User from "@/models/UserModel";
import { NextResponse } from "next/server";

// register a user
export const POST = async (request) => {
    const {username, email, password} = await request.json();
    if (!email || !password) {
        return new NextResponse("Please enter all fields", {status: 422})
    }
    await connectDB();    
    try {
        // check if user already exists using email to avoid duplicates
        const userAlreadyExists = await User.findOne({email});
        if (userAlreadyExists) {
            return new NextResponse("User already exists", {status: 422})
        }
        const verificationToken = generateVerificationCode();
        const newUser = new User({
            username: username || email.split("@")[0],
            email, 
            password, 
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 *60 *1000, // One day
        });
        
        await sendVerificationEmail(email, verificationToken);
        const savedUser = await newUser.save();
        return NextResponse.json(
            { message: 'User created successfully', 
              success: true,
              user: {
                ...savedUser._doc,
                password: undefined,
            }},
            { status: 201 }
        )
    } catch (error) {
        return new NextResponse(error.message, {status: 500,})
    }
}

// get all users or a single user
export const GET = async (request) => {
    const params = new URLSearchParams(request.url.split('?')[1]);
    const email = params.get("email")
    await connectDB();
    try {
        // check if user already exists using email to avoid duplicates
        if (email){
            const user = await User.findOne({email});
            if (!user) {
                return new NextResponse("User not found", {status: 404})
            }
            return NextResponse.json(
                { message: 'User found', success: true, 
                    user: {
                    ...savedUser._doc,
                    password: undefined,
                }},
                {status: 200}
            )
        }
        const users = await User.find().select("-password");

        return NextResponse.json(users, {status: 200},)
    } catch (error) {
        return new NextResponse(error.message, {status: 500,})
    }
}

// update user details
export const PUT = async (request) => {
    const body = await request.json();
    const {_id} = body;
    try {
      const newUserDoc = await User.findOneAndUpdate({_id}, {...body});
      const updatedUserDoc = await User.findOne({
        _id: newUserDoc._id,
      }).select("-password");
      return NextResponse.json(
        { message: 'User updated successfully', 
          success: true, 
          user: updatedUserDoc
        }, 
        { status: 200 }
      );
    } catch (error) {
      console.log('User Updating error!');
      return new NextResponse(error.message, {status: 422});
    }
}

// delete a user
export const DELETE = async (request) => {
    const params = new URLSearchParams(request.url.split('?')[1]);
    const id = params.get("id");
    await connectDB();
    try {
        // perform delete action
        const user = await User.findOneAndDelete({_id: id});
        if (!user) {
            return new NextResponse("User not found", {status: 404})
        }
        return new NextResponse("User deleted successfully", {status: 200})
    } catch (error) {
        return new NextResponse(error.message, {status: 500, })
    }
}