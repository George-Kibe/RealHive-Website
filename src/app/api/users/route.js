import User from "@/models/User";
import { NextResponse } from "next/server";
import connect from "@/utils/db";

async function handler(req,res){
    const {method} = req;
    await connect();
    if (method === "GET"){
        const url = new URL(req.url);
        const id = url.searchParams.get("id")
        if(id){
          try {
              const user = await User.findOne({_id:id})
              const userData = JSON.stringify(user)
              return new NextResponse(userData, {status: 200})
          } catch (error) {
              return new NextResponse('No User with That ID', {status: 404})
          }
        }
        const users = await  User.find()
        const allUsers = JSON.stringify(users)
        // console.log(allUsers)
        return new NextResponse(allUsers, {status: 200})
      }   
    
    if (method === "POST"){
        const body = await req.json()
        const {username,email, referralCode} = body;
        const existUsername = await User.findOne({username})
        const existEmail = await User.findOne({email})
        const existReferralCode = await User.findOne({referralCode})
        const newUser = new User(body)      
        console.log(!!existUsername, !!existEmail, !!existReferralCode)  
        try {
            await newUser.validate();
            // await newUser.save();
            return new NextResponse("User has been created", {status: 201})
        } catch (error) {
            console.log("User saving error!")
            return new NextResponse(error.message, {status: 422})
        }      
    }
    if (method === "PUT"){
        const body = await req.json()
        const {title, description, properties, category, images, price, _id} = body;
        try {
            await User.updateOne({_id}, {title, description, properties,category, images, price:parseInt(price)})
            console.log("Updated!")
            return new NextResponse("User has been Updated", {status: 200})
        } catch (error) {
            console.log("User saving error!")
            return new NextResponse(error.message, {status: 422})
        }      
    }     
}

export { handler as GET, handler as POST, handler as PUT };