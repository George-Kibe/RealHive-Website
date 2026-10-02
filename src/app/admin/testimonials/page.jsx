import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/adminAuth";
import Testimonial from "@/models/TestimonialModel";
import AdminHeader from "@/components/admin/AdminHeader";
import TestimonialsManager from "@/components/admin/TestimonialsManager";

export const metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  // getAdmin() also connects to the database
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  const testimonials = (await Testimonial.find().sort({ order: 1, createdAt: -1 }).lean()).map((t) => ({
    _id: t._id.toString(),
    name: t.name,
    role: t.role ?? "",
    company: t.company ?? "",
    quote: t.quote,
    avatarPublicId: t.avatarPublicId ?? "",
    published: t.published,
    order: t.order ?? 0,
  }));

  return (
    <div>
      <AdminHeader title="Testimonials" email={admin.email} current="/admin/testimonials" />
      <p className="mt-4 text-sm text-muted-foreground">
        Published testimonials appear on the Services page, lowest order number first. The section stays hidden until at least one is published.
      </p>
      <TestimonialsManager testimonials={testimonials} />
    </div>
  );
}
