import mongoose from "mongoose";
import { connectDB } from "@/db/connectDB";
import { getAdmin } from "@/lib/adminAuth";
import { getSessionUser } from "@/lib/session";
import Comment from "@/models/CommentModel";
import { NextResponse } from "next/server";

// delete a comment: its author (website session) or an admin (dashboard session)
export const DELETE = async (request, { params }) => {
    const [user, admin] = await Promise.all([getSessionUser(), getAdmin()]);
    if (!user && !admin) {
        return new NextResponse("Unauthorized", {status: 401});
    }
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
        return new NextResponse("Comment not found", {status: 404});
    }
    await connectDB();
    try {
        const comment = await Comment.findById(id);
        if (!comment) {
            return new NextResponse("Comment not found", {status: 404});
        }
        if (!admin && comment.user.toString() !== user._id.toString()) {
            return new NextResponse("You can only delete your own comments", {status: 403});
        }
        await comment.deleteOne();
        return new NextResponse("Comment deleted successfully", {status: 200});
    } catch (error) {
        return new NextResponse(error.message, {status: 500});
    }
}
