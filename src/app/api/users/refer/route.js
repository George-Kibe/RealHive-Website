import User, { Referee } from "@/models/User";
import connect from "@/utils/db";

import { NextResponse } from "next/server";

export const POST = async (request,response) => {
    const body = await request.json();
    console.log("Request Body: ", body)
    const {_id, code} = body;
    try {
        await connect();
        // create one referee with default status null
        const newRef = new Referee({user: _id, status:"Null"})
        await newRef.validate()
        const exisingRef = await Referee.findOne({user:_id})
        console.log("ExistingRef: ", exisingRef)
        if (exisingRef){
            return new NextResponse("user is already referred by someone else", {status:200})
        }
        const refDoc = await newRef.save()
        console.log("RefDocument: ", refDoc)
        let newRefs = [refDoc]
        // get user by referral code
        // update number of referees with one
        try {
            const user = await User.findOne({referralCode:code});
            console.log("User:", user)
            const {_id, referees} = user;
            for (const ref of referees) {
                if (!newRefs.includes(ref)) {
                    newRefs.push(ref);
                }
              }
            await User.findOneAndUpdate({_id}, {referees: newRefs})
            console.log("Updated!")
            return new NextResponse(JSON.stringify(user), {status:200})
        } catch (error) {
            console.log("Error: ", error)
            return new NextResponse("User not Found or Invalid Referral Code", {status:404})
        }        
    } catch (error) {
        return new NextResponse("Database Error", { status:500})
    }
}

// update status to secondary
export const PUT = async (request,response) => {
    const body = await request.json();
    console.log("Request Body: ", body)
    const {_id,status} = body;
    try {
        await connect();
        // create one referee with default status primary
        const exisingRef = await Referee.findOneAndUpdate({user:_id}, {status})
        if (exisingRef){
            return new NextResponse("Updated successfully!", {status:200})
        }else{
            return new NextResponse("User not Found", {status:404})
        }      
    } catch (error) {
        console.log("Error: ", error)
        return new NextResponse("Database Error", { status:500})
    }
}


