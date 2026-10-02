import mongoose from "mongoose";
import { notFound, redirect } from "next/navigation";
import { getAdmin } from "@/lib/adminAuth";
import Comment from "@/models/CommentModel";
import Post from "@/models/PostModel";
import "@/models/UserModel";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminComments from "@/components/admin/AdminComments";
import PostEditor from "@/components/admin/PostEditor";

export const metadata = { title: "Edit post" };

export default async function EditPostPage({ params }) {
  // getAdmin() also connects to the database
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) notFound();
  const post = await Post.findById(id).lean();
  if (!post) notFound();
  const comments = await Comment.find({ post: post._id }).sort({ createdAt: -1 }).populate("user", "username email").lean();

  return (
    <div>
      <AdminHeader title="Edit post" email={admin.email} current="/admin/blog" />
      <PostEditor
        post={{
          _id: post._id.toString(),
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content,
          tags: post.tags ?? [],
          coverImage: post.coverImage?.publicId ? { publicId: post.coverImage.publicId, alt: post.coverImage.alt ?? "" } : null,
          published: post.published,
        }}
      />
      <AdminComments
        comments={comments.map((c) => ({
          _id: c._id.toString(),
          body: c.body,
          createdAt: c.createdAt.toISOString(),
          user: c.user ? { username: c.user.username, email: c.user.email } : null,
        }))}
      />
    </div>
  );
}
