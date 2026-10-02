"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { buttonVariants } from "@/components/ui/button";

const EMPTY_FORM = { name: "", role: "", company: "", quote: "", avatarUrl: "", published: false, order: 0 };

const inputClass =
  "mt-1 w-full rounded-md border-0 bg-muted text-foreground placeholder:text-muted-foreground px-3.5 py-2 shadow-xs ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6";

const errorMessage = (error) =>
  error.response?.status === 401
    ? "Your session has expired. Please sign in again."
    : typeof error.response?.data === "string" && error.response.data
      ? error.response.data
      : "Something went wrong. Please try again.";

const TestimonialsManager = ({ testimonials }) => {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.quote.trim()) {
      toast.error("Name and quote are required");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await axios.put(`/api/testimonials/${editingId}`, form);
        toast.success("Testimonial updated");
      } else {
        await axios.post("/api/testimonials", form);
        toast.success("Testimonial added");
      }
      resetForm();
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (testimonial) => {
    setEditingId(testimonial._id);
    setForm({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      quote: testimonial.quote,
      avatarUrl: testimonial.avatarUrl,
      published: testimonial.published,
      order: testimonial.order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const togglePublished = async (testimonial) => {
    setBusyId(testimonial._id);
    try {
      await axios.put(`/api/testimonials/${testimonial._id}`, { published: !testimonial.published });
      toast.success(testimonial.published ? "Unpublished" : "Published");
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (testimonial) => {
    if (!window.confirm(`Delete the testimonial from ${testimonial.name}? This can't be undone.`)) return;
    setBusyId(testimonial._id);
    try {
      await axios.delete(`/api/testimonials/${testimonial._id}`);
      if (editingId === testimonial._id) resetForm();
      toast.success("Testimonial deleted");
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mt-8">
      <ToastContainer />

      <form onSubmit={handleSubmit} className="rounded-lg p-4 ring-1 ring-border sm:p-6">
        <h2 className="text-lg font-semibold">{editingId ? "Edit testimonial" : "Add a testimonial"}</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="t-name" className="block text-sm font-medium">Name *</label>
            <input id="t-name" required maxLength={100} value={form.name} onChange={update("name")} className={inputClass} />
          </div>
          <div>
            <label htmlFor="t-role" className="block text-sm font-medium">Role</label>
            <input id="t-role" maxLength={100} placeholder="e.g. CTO" value={form.role} onChange={update("role")} className={inputClass} />
          </div>
          <div>
            <label htmlFor="t-company" className="block text-sm font-medium">Company</label>
            <input id="t-company" maxLength={100} value={form.company} onChange={update("company")} className={inputClass} />
          </div>
          <div>
            <label htmlFor="t-avatar" className="block text-sm font-medium">Photo URL</label>
            <input id="t-avatar" type="url" placeholder="https://..." value={form.avatarUrl} onChange={update("avatarUrl")} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="t-quote" className="block text-sm font-medium">Quote *</label>
            <textarea id="t-quote" required maxLength={1000} rows={4} value={form.quote} onChange={update("quote")} className={inputClass} />
          </div>
          <div>
            <label htmlFor="t-order" className="block text-sm font-medium">Order</label>
            <input id="t-order" type="number" value={form.order} onChange={update("order")} className={inputClass} />
          </div>
          <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium">
            <input type="checkbox" checked={form.published} onChange={update("published")} className="h-4 w-4 accent-brand" />
            Published on the site
          </label>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="submit" disabled={saving} className={buttonVariants({ variant: "brand" })}>
            {saving ? "Saving..." : editingId ? "Save changes" : "Add testimonial"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className={buttonVariants({ variant: "outline" })}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {testimonials.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No testimonials yet. Add your first one above.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {testimonials.map((testimonial) => (
            <li key={testimonial._id} className="rounded-lg p-4 ring-1 ring-border">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold">
                    {testimonial.name}
                    <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-border ${testimonial.published ? "text-brand" : "text-muted-foreground"}`}>
                      {testimonial.published ? "Published" : "Draft"}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {[testimonial.role, testimonial.company].filter(Boolean).join(", ") || "No role or company"} · order {testimonial.order}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => startEdit(testimonial)} className={buttonVariants({ variant: "outline", size: "sm" })}>
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={busyId === testimonial._id}
                    onClick={() => togglePublished(testimonial)}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    {testimonial.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    type="button"
                    disabled={busyId === testimonial._id}
                    onClick={() => remove(testimonial)}
                    className={buttonVariants({ variant: "destructive", size: "sm" })}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm leading-6">&ldquo;{testimonial.quote}&rdquo;</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TestimonialsManager;
