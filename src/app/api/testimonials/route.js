import { connectDB } from "@/db/connectDB";
import { getAdmin } from "@/lib/adminAuth";
import { pickTestimonialFields, revalidateTestimonialPages } from "@/lib/testimonials";
import Testimonial from "@/models/TestimonialModel";
import { NextResponse } from "next/server";

// get testimonials: published only, or all of them for an admin with ?all=true
export const GET = async (request) => {
    const params = new URLSearchParams(request.url.split('?')[1]);
    const wantsAll = params.get("all") === "true";
    if (wantsAll && !(await getAdmin())) {
        return new NextResponse("Unauthorized", {status: 401});
    }
    await connectDB();
    try {
        const testimonials = await Testimonial.find(wantsAll ? {} : {published: true})
            .sort({order: 1, createdAt: -1});
        return NextResponse.json(
            { success: true, testimonials },
            { status: 200 }
        )
    } catch (error) {
        return new NextResponse(error.message, {status: 500})
    }
}

// create a testimonial (admin only)
export const POST = async (request) => {
    if (!(await getAdmin())) {
        return new NextResponse("Unauthorized", {status: 401});
    }
    let fields;
    try {
        fields = pickTestimonialFields(await request.json());
    } catch (error) {
        return new NextResponse(error.message, {status: 422});
    }
    if (!fields.name?.trim() || !fields.quote?.trim()) {
        return new NextResponse("Name and quote are required", {status: 422});
    }
    await connectDB();
    try {
        const testimonial = await Testimonial.create(fields);
        revalidateTestimonialPages();
        return NextResponse.json(
            { message: 'Testimonial created successfully', success: true, testimonial },
            { status: 201 }
        )
    } catch (error) {
        const status = error.name === "ValidationError" ? 422 : 500;
        return new NextResponse(error.message, {status});
    }
}
