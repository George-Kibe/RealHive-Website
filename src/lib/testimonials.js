import { revalidatePath } from "next/cache";
import { connectDB } from "@/db/connectDB";
import Testimonial from "@/models/TestimonialModel";

const EDITABLE_FIELDS = ["name", "role", "company", "quote", "avatarPublicId", "published", "order"];

// Cloudinary public IDs: folders, letters, digits, - _ . (what the upload widget returns)
const PUBLIC_ID_PATTERN = /^[\w\-./]{1,255}$/;

// pick only the fields an admin may set, so request bodies can't write _id, timestamps, etc.
export const pickTestimonialFields = (body = {}) => {
    const fields = {};
    for (const key of EDITABLE_FIELDS) {
        if (body[key] !== undefined) fields[key] = body[key];
    }
    if (fields.published !== undefined) fields.published = Boolean(fields.published);
    if (fields.order !== undefined) fields.order = Number(fields.order) || 0;
    if (fields.avatarPublicId !== undefined) {
        fields.avatarPublicId = String(fields.avatarPublicId).trim();
        if (fields.avatarPublicId && !PUBLIC_ID_PATTERN.test(fields.avatarPublicId)) {
            throw new Error("Invalid photo");
        }
    }
    return fields;
};

// published testimonials for the public site; returns [] if the database is unreachable
export const getPublishedTestimonials = async () => {
    try {
        await connectDB();
        const testimonials = await Testimonial.find({published: true})
            .sort({order: 1, createdAt: -1})
            .lean();
        return testimonials.map((t) => ({...t, _id: t._id.toString()}));
    } catch (error) {
        console.log("Error loading testimonials: ", error.message);
        return [];
    }
};

// rebuild the pages that show testimonials after an admin change
export const revalidateTestimonialPages = () => {
    revalidatePath("/services");
};
