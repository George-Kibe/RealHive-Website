import User, { Referee } from "@/models/User";
import connect from "@/utils/db";

import { NextResponse } from "next/server";

export const GET = async (request, {params}) => {
    const { email } = params;
    console.log(email)
    try {
        await connect();
        try {
            const user = await User.findOne({email})
            const {referees} = user
            if(referees.length > 0){
                const refs = []
                for (let i = 0; i < referees.length; i++) {
                    const ref = await Referee.findById(referees[i]).populate("user")
                    console.log("Ref: ", ref)
                    refs.push(ref)
                  }
                return new NextResponse(JSON.stringify({"user":user, "listOfReferees":refs}), {status:200})
            }
            return new NextResponse(JSON.stringify({"user": user}), {status:200})
        } catch (error) {
            return new NextResponse("User not Found or Invalid ID", {status:404})
        }        
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