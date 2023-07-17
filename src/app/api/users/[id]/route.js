import User from "@/models/User";
import connect from "@/utils/db";

import { NextResponse } from "next/server";

export const GET = async (request, {params}) => {
    const {id} = params;
    console.log(id)
    try {
        await connect();
        const User = await User.findById(id);
        return new NextResponse(JSON.stringify(User), {status:200})
    } catch (error) {
        return new NextResponse("Database Error", { status:500})
    }
}

export const DELETE = async (request, {params}) => {
    const {id} = params;
    try {
        await connect();
        await User.findByIdAndDelete(id);
        return new NextResponse("User has been deleted!", {status:200})
    } catch (error) {
        return new NextResponse("Internal Server Error", { status:500})
    }
}