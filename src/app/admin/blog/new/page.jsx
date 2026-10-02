import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/adminAuth";
import AdminHeader from "@/components/admin/AdminHeader";
import PostEditor from "@/components/admin/PostEditor";

export const metadata = { title: "New post" };

export default async function NewPostPage() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div>
      <AdminHeader title="New post" email={admin.email} current="/admin/blog" />
      <PostEditor />
    </div>
  );
}
