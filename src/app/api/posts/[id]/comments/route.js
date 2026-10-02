import mongoose from "mongoose";
import { connectDB } from "@/db/connectDB";
import { getSessionUser } from "@/lib/session";
import Comment from "@/models/CommentModel";
import Post from "@/models/PostModel";
import "@/models/UserModel";
import { NextResponse } from "next/server";

const MAX_COMMENT_LENGTH = 2000;

const serializeComment = (comment) => ({
    _id: comment._id.toString(),
    body: comment.body,
    createdAt: comment.createdAt,
    user: comment.user ? { _id: comment.user._id.toString(), username: comment.user.username } : null,
});

// get the comments on a published post, oldest first
export const GET = async (request, { params }) => {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
        return new NextResponse("Post not found", {status: 404});
    }
    await connectDB();
    try {
        if (!(await Post.exists({_id: id, published: true}))) {
            return new NextResponse("Post not found", {status: 404});
        }
        const comments = await Comment.find({post: id}).sort({createdAt: 1}).populate("user", "username").lean();
        return NextResponse.json(
            { success: true, comments: comments.map(serializeComment) },
            { status: 200, headers: { "Cache-Control": "no-store" } }
        )
    } catch (error) {
        return new NextResponse(error.message, {status: 500})
    }
}

// comment on a published post (signed-in, verified users only)
export const POST = async (request, { params }) => {
    const user = await getSessionUser();
    if (!user) {
        return new NextResponse("Please sign in to comment", {status: 401});
    }
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
        return new NextResponse("Post not found", {status: 404});
    }
    const {body} = await request.json();
    const text = typeof body === "string" ? body.trim() : "";
    if (!text) {
        return new NextResponse("Comment cannot be empty", {status: 422});
    }
    if (text.length > MAX_COMMENT_LENGTH) {
        return new NextResponse(`Comments are limited to ${MAX_COMMENT_LENGTH} characters`, {status: 422});
    }
    await connectDB();
    try {
        if (!(await Post.exists({_id: id, published: true}))) {
            return new NextResponse("Post not found", {status: 404});
        }
        const comment = await Comment.create({post: id, user: user._id, body: text});
        return NextResponse.json(
            { message: 'Comment added', success: true,
              comment: serializeComment({...comment.toObject(), user}) },
            { status: 201 }
        )
    } catch (error) {
        return new NextResponse(error.message, {status: 500})
    }
}
