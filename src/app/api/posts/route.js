import { connectDB } from "@/db/connectDB";
import { getAdmin } from "@/lib/adminAuth";
import { pickPostFields, revalidateBlog } from "@/lib/blog";
import Post from "@/models/PostModel";
import "@/models/UserModel";
import { NextResponse } from "next/server";

// get posts: published only (without content), or all of them for an admin with ?all=true
export const GET = async (request) => {
    const params = new URLSearchParams(request.url.split('?')[1]);
    const wantsAll = params.get("all") === "true";
    if (wantsAll && !(await getAdmin())) {
        return new NextResponse("Unauthorized", {status: 401});
    }
    await connectDB();
    try {
        const posts = await Post.find(wantsAll ? {} : {published: true})
            .sort(wantsAll ? {updatedAt: -1} : {publishedAt: -1})
            .select("-content")
            .populate("author", "username");
        return NextResponse.json({ success: true, posts }, { status: 200 })
    } catch (error) {
        return new NextResponse(error.message, {status: 500})
    }
}

// create a post (admin only)
export const POST = async (request) => {
    const admin = await getAdmin();
    if (!admin) {
        return new NextResponse("Unauthorized", {status: 401});
    }
    let fields;
    try {
        fields = pickPostFields(await request.json());
    } catch (error) {
        return new NextResponse(error.message, {status: 422});
    }
    await connectDB();
    try {
        if (await Post.exists({slug: fields.slug})) {
            return new NextResponse("A post with this slug already exists", {status: 409});
        }
        const post = await Post.create({
            ...fields,
            author: admin._id,
            publishedAt: fields.published ? new Date() : undefined,
        });
        revalidateBlog(post.slug);
        return NextResponse.json(
            { message: 'Post created successfully', success: true, post },
            { status: 201 }
        )
    } catch (error) {
        const status = error.name === "ValidationError" ? 422 : 500;
        return new NextResponse(error.message, {status});
    }
}
