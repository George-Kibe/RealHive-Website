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
              const propertyData = JSON.stringify(Property)
              return new NextResponse(propertyData, {status: 200})
          } catch (error) {
              return new NextResponse('No Property with That ID', {status: 404})
          }
        }
        const Propertys = await  Property.find()
        const allPropertys = JSON.stringify(Propertys)
        // console.log(allPropertys)
        return new NextResponse(allPropertys, {status: 200})
      }   
    
    if (method === "POST"){
        const body = await req.json()
        const {title, description, category, images, price, properties} = body;
        const newProperty = new Property({
            title, description, properties, category, images, price:parseInt(price)
        })
        try {
            await newProperty.save();
            console.log("saved!")
            return new NextResponse("Property has been created", {status: 201})
        } catch (error) {
            console.log("Property saving error!")
            return new NextResponse(error.message, {status: 422})
        }      
    }
    if (method === "PUT"){
        const body = await req.json()
        const {title, description, properties, category, images, price, _id} = body;
        try {
            await Property.updateOne({_id}, {title, description, properties,category, images, price:parseInt(price)})
            console.log("Updated!")
            return new NextResponse("Property has been Updated", {status: 200})
        } catch (error) {
            console.log("Property saving error!")
            return new NextResponse(error.message, {status: 422})
        }      
    }     
}

export { handler as GET, handler as POST, handler as PUT };