import mongoose from "mongoose";
import { connectDB } from "@/db/connectDB";
import { getAdmin } from "@/lib/adminAuth";
import { pickTestimonialFields, revalidateTestimonialPages } from "@/lib/testimonials";
import Testimonial from "@/models/TestimonialModel";
import { NextResponse } from "next/server";

// update a testimonial (admin only)
export const PUT = async (request, { params }) => {
    if (!(await getAdmin())) {
        return new NextResponse("Unauthorized", {status: 401});
    }
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
        return new NextResponse("Testimonial not found", {status: 404});
    }
    let fields;
    try {
        fields = pickTestimonialFields(await request.json());
    } catch (error) {
        return new NextResponse(error.message, {status: 422});
    }
    if (("name" in fields && !fields.name?.trim()) || ("quote" in fields && !fields.quote?.trim())) {
        return new NextResponse("Name and quote are required", {status: 422});
    }
    await connectDB();
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(id, fields, {returnDocument: "after", runValidators: true});
        if (!testimonial) {
            return new NextResponse("Testimonial not found", {status: 404});
        }
        revalidateTestimonialPages();
        return NextResponse.json(
            { message: 'Testimonial updated successfully', success: true, testimonial },
            { status: 200 }
        )
    } catch (error) {
        const status = error.name === "ValidationError" ? 422 : 500;
        return new NextResponse(error.message, {status});
    }
}

// delete a testimonial (admin only)
export const DELETE = async (request, { params }) => {
    if (!(await getAdmin())) {
        return new NextResponse("Unauthorized", {status: 401});
    }
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
        return new NextResponse("Testimonial not found", {status: 404});
    }
    await connectDB();
    try {
        const testimonial = await Testimonial.findByIdAndDelete(id);
        if (!testimonial) {
            return new NextResponse("Testimonial not found", {status: 404});
        }
        revalidateTestimonialPages();
        return new NextResponse("Testimonial deleted successfully", {status: 200});
    } catch (error) {
        return new NextResponse(error.message, {status: 500});
    }
}
