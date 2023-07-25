import Property from "@/models/Property";
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
              const property = await Property.findOne({_id:id})
              const propertyData = JSON.stringify(property)
              return new NextResponse(propertyData, {status: 200})
          } catch (error) {
              return new NextResponse('No Property with That ID', {status: 404})
          }
        }
        const properties = await  Property.find()
        const allProperties = JSON.stringify(properties)
        // console.log(allPropertys)
        return new NextResponse(allProperties, {status: 200})
      }   
    
    if (method === "POST"){
        const body = await req.json()
        const {title, newPrice, latitude, longitude, images} = body;
        if(!title ||!newPrice ||! latitude ||!longitude ||!images){
            return new NextResponse("Property Necessary Details Missing", {status: 422})
        }
        const newProperty = new Property(body)
        try {
            await newProperty.validate();
            await newProperty.save();
            return new NextResponse("Property has been created", {status: 201})
        } catch (error) {
            console.log("Property saving error!")
            return new NextResponse(error.message, {status: 422})
        }      
    }
    if (method === "PUT"){
        const body = await req.json()
        // const {_id, title, description, type, image, images, address, video, perks, amenities, views, verified, published,
        //     area, rating, ratings, contactNumber, contactEmail, priceType, newprice, latitude, longitude} = body;
        const {_id} = body;
        try {
            await Property.updateOne({_id}, {...body})
            console.log("Updated!")
            return new NextResponse("Property has been Updated", {status: 200})
        } catch (error) {
            console.log("Property Updating error!")
            return new NextResponse(error.message, {status: 422})
        }      
    }     
}

export { handler as GET, handler as POST, handler as PUT };