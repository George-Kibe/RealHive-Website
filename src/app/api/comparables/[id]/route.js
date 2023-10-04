import Comparable from "@/models/Property";
import connect from "@/utils/db";

import { NextResponse } from "next/server";

export const GET = async (request, {params}) => {
    const {id} = params;
    console.log(id)
    try {
        await connect();
        try {
            const property = await Property.findById(id);
            return new NextResponse(JSON.stringify(property), {status:200})
        } catch (error) {
            return new NextResponse("Property not Found or Invalid ID", {status:404})
        } 
    } catch (error) {
        return new NextResponse("Database Error", { status:500})
    }
}

export const DELETE = async (request, {params}) => {
    const {id} = params;
    try {
        await connect();
        await Property.findByIdAndDelete(id);
        return new NextResponse("Property has been deleted!", {status:200})
    } catch (error) {
        return new NextResponse("Internal Server Error", { status:500})
    }
}