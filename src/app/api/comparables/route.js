import Comparable from "@/models/Comparable";
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
              const comparable = await Comparable.findOne({_id:id})
              const comparableData = JSON.stringify(comparable)
              return new NextResponse(comparableData, {status: 200})
          } catch (error) {
              return new NextResponse('No comparable with That ID', {status: 404})
          }
        }
        const comparables = await  Comparable.find()
        const allComparables = JSON.stringify(comparables)
        // console.log(allComparables)
        return new NextResponse(allComparables, {status: 200})
      }   
    
    if (method === "POST"){
        const body = await req.json()
        const {title, price, date, latitude, longitude} = body;
        if(!title ||!price ||! latitude ||!longitude ||!date){
            return new NextResponse("Comparable Necessary Details Missing", {status: 422})
        }
        const newComparable = new Comparable(body)
        try {
            await newComparable.validate();
            await newComparable.save();
            return new NextResponse("Comparable has been created", {status: 201})
        } catch (error) {
            console.log("Comparable saving error!")
            return new NextResponse(error.message, {status: 422})
        }      
    }
    if (method === "PUT"){
        const body = await req.json()
        // const {_id, title, description, type, image, images, address, video, perks, amenities, views, verified, published,
        //     area, rating, ratings, contactNumber, contactEmail, priceType, newprice, latitude, longitude} = body;
        const {_id} = body;
        try {
            await Comparable.updateOne({_id}, {...body})
            console.log("Updated!")
            return new NextResponse("Comparable has been Updated", {status: 200})
        } catch (error) {
            console.log("Comparable Updating error!")
            return new NextResponse(error.message, {status: 422})
        }      
    }     
}

export { handler as GET, handler as POST, handler as PUT };