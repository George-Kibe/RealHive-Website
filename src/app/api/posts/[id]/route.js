import mongoose from "mongoose";
import { connectDB } from "@/db/connectDB";
import { getAdmin } from "@/lib/adminAuth";
import { pickPostFields, revalidateBlog } from "@/lib/blog";
import Comment from "@/models/CommentModel";
import Post from "@/models/PostModel";
import "@/models/UserModel";
import { NextResponse } from "next/server";

// get one post with its content: published posts for anyone, drafts for admins
export const GET = async (request, { params }) => {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
        return new NextResponse("Post not found", {status: 404});
    }
    await connectDB();
    try {
        const post = await Post.findById(id).populate("author", "username");
        if (!post || (!post.published && !(await getAdmin()))) {
            return new NextResponse("Post not found", {status: 404});
        }
        return NextResponse.json({ success: true, post }, { status: 200 })
    } catch (error) {
        return new NextResponse(error.message, {status: 500})
    }
}

// update a post (admin only)
export const PUT = async (request, { params }) => {
    if (!(await getAdmin())) {
        return new NextResponse("Unauthorized", {status: 401});
    }
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
        return new NextResponse("Post not found", {status: 404});
    }
    let fields;
    try {
        fields = pickPostFields(await request.json(), { partial: true });
    } catch (error) {
        return new NextResponse(error.message, {status: 422});
    }
    await connectDB();
    try {
        const existing = await Post.findById(id);
        if (!existing) {
            return new NextResponse("Post not found", {status: 404});
        }
        if (fields.slug && fields.slug !== existing.slug && (await Post.exists({slug: fields.slug}))) {
            return new NextResponse("A post with this slug already exists", {status: 409});
        }
        const oldSlug = existing.slug;
        existing.set(fields);
        if (existing.published && !existing.publishedAt) existing.publishedAt = new Date();
        const post = await existing.save();
        revalidateBlog(oldSlug, post.slug);
        return NextResponse.json(
            { message: 'Post updated successfully', success: true, post },
            { status: 200 }
        )
    } catch (error) {
        const status = error.name === "ValidationError" ? 422 : 500;
        return new NextResponse(error.message, {status});
    }
}

// delete a post and its comments (admin only)
export const DELETE = async (request, { params }) => {
    if (!(await getAdmin())) {
        return new NextResponse("Unauthorized", {status: 401});
    }
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
        return new NextResponse("Post not found", {status: 404});
    }
    await connectDB();
    try {
        const post = await Post.findByIdAndDelete(id);
        if (!post) {
            return new NextResponse("Post not found", {status: 404});
        }
        await Comment.deleteMany({post: post._id});
        revalidateBlog(post.slug);
        return new NextResponse("Post deleted successfully", {status: 200});
    } catch (error) {
        return new NextResponse(error.message, {status: 500});
    }
}
