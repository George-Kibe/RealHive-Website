import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/adminAuth";
import Comment from "@/models/CommentModel";
import Post from "@/models/PostModel";
import AdminHeader from "@/components/admin/AdminHeader";
import { buttonVariants } from "@/components/ui/button";
import { formatPostDate } from "@/components/blog/formatPostDate";

export const metadata = { title: "Blog" };

export default async function AdminBlogPage() {
  // getAdmin() also connects to the database
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  const [posts, commentCounts] = await Promise.all([
    Post.find().sort({ updatedAt: -1 }).select("title slug published publishedAt updatedAt").lean(),
    Comment.aggregate([{ $group: { _id: "$post", count: { $sum: 1 } } }]),
  ]);
  const countByPost = new Map(commentCounts.map((c) => [c._id.toString(), c.count]));

  return (
    <div>
      <AdminHeader title="Blog posts" email={admin.email} current="/admin/blog" />
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {posts.length} post{posts.length === 1 ? "" : "s"} · {posts.filter((p) => p.published).length} published
        </p>
        <Link href="/admin/blog/new" className={buttonVariants({ variant: "brand" })}>New post</Link>
      </div>

      {posts.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No posts yet. Write your first one.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg ring-1 ring-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Title</th>
                <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                <th scope="col" className="px-4 py-3 font-semibold">Comments</th>
                <th scope="col" className="px-4 py-3 font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((post) => (
                <tr key={post._id.toString()}>
                  <td className="px-4 py-3">
                    <Link href={`/admin/blog/${post._id}`} className="font-medium hover:underline">{post.title}</Link>
                    {post.published && (
                      <Link href={`/blog/${post.slug}`} className="ml-2 text-xs text-muted-foreground hover:text-foreground">View &rarr;</Link>
                    )}
                  </td>
                  <td className={`px-4 py-3 ${post.published ? "text-brand" : "text-muted-foreground"}`}>
                    {post.published ? "Published" : "Draft"}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{countByPost.get(post._id.toString()) ?? 0}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatPostDate(post.updatedAt.toISOString())}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
