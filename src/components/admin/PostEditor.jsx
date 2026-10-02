"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BlogImage from "@/components/blog/BlogImage";
import CloudinaryUploadButton from "@/components/admin/CloudinaryUploadButton";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { buttonVariants } from "@/components/ui/button";
import { slugify } from "@/lib/slugify";

const inputClass =
  "mt-1 w-full rounded-md border-0 bg-muted text-foreground placeholder:text-muted-foreground px-3.5 py-2 shadow-xs ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-brand sm:text-sm sm:leading-6";

const errorMessage = (error) =>
  error.response?.status === 401
    ? "Your session has expired. Please sign in again."
    : typeof error.response?.data === "string" && error.response.data
      ? error.response.data
      : "Something went wrong. Please try again.";

/**
 * Create or edit a blog post. Cover images go straight from the browser to
 * Cloudinary through the signed upload widget; only the resulting public ID is
 * stored on the post.
 */
const PostEditor = ({ post }) => {
  const router = useRouter();
  const isNew = !post;
  const [form, setForm] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    tags: (post?.tags ?? []).join(", "),
    published: post?.published ?? false,
  });
  const [cover, setCover] = useState(post?.coverImage ?? null);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const update = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "title" && !slugTouched ? { slug: slugify(value) } : {}),
    }));
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      coverImage: cover ?? { publicId: "" },
    };
    try {
      if (isNew) {
        const res = await axios.post("/api/posts", payload);
        toast.success("Post created");
        router.replace(`/admin/blog/${res.data.post._id}`);
      } else {
        await axios.put(`/api/posts/${post._id}`, payload);
        toast.success(form.published ? "Saved and published" : "Saved as draft");
      }
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete "${post.title}" and all its comments? This can't be undone.`)) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/posts/${post._id}`);
      router.replace("/admin/blog");
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={save} className="mt-8 space-y-6">
      <ToastContainer />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="p-title" className="block text-sm font-medium">Title *</label>
          <input id="p-title" required maxLength={150} value={form.title} onChange={update("title")} className={inputClass} />
        </div>
        <div>
          <label htmlFor="p-slug" className="block text-sm font-medium">URL slug</label>
          <div className="mt-1 flex items-center rounded-md bg-muted ring-1 ring-inset ring-border focus-within:ring-2 focus-within:ring-brand">
            <span className="pl-3.5 text-sm text-muted-foreground">/blog/</span>
            <input
              id="p-slug"
              value={form.slug}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              title="Lowercase letters, numbers and hyphens"
              onChange={(e) => { setSlugTouched(true); update("slug")(e); }}
              className="min-w-0 flex-1 border-0 bg-transparent py-2 pr-3.5 text-foreground focus:ring-0 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label htmlFor="p-tags" className="block text-sm font-medium">Tags</label>
          <input id="p-tags" placeholder="AI, Programming" value={form.tags} onChange={update("tags")} className={inputClass} />
          <p className="mt-1 text-xs text-muted-foreground">Comma-separated, up to 10.</p>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="p-excerpt" className="block text-sm font-medium">Excerpt</label>
          <textarea id="p-excerpt" rows={2} maxLength={300} value={form.excerpt} onChange={update("excerpt")} className={inputClass}
            placeholder="One or two sentences shown on the blog list and in search results" />
        </div>
      </div>

      <fieldset className="rounded-lg p-4 ring-1 ring-border">
        <legend className="px-1 text-sm font-medium">Cover image</legend>
        {cover ? (
          <div className="space-y-3">
            <BlogImage publicId={cover.publicId} alt={cover.alt} width={800} height={400} sizes="(min-width: 768px) 600px, 100vw"
              className="aspect-2/1 w-full max-w-xl rounded-md object-cover" />
            <p className="break-all text-xs text-muted-foreground">{cover.publicId}</p>
            <div>
              <label htmlFor="p-alt" className="block text-sm font-medium">Alt text</label>
              <input id="p-alt" maxLength={200} value={cover.alt} placeholder="Describe the image for screen readers"
                onChange={(e) => setCover((c) => ({ ...c, alt: e.target.value }))} className={inputClass} />
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No cover image. Posts look best with one (16:9 or wider).</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <CloudinaryUploadButton
            folder="realhive/blog"
            label={cover ? "Replace image" : "Upload image"}
            onUploaded={(publicId) => setCover((c) => ({ publicId, alt: c?.alt ?? "" }))}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            {cover ? "Replace image" : "Upload image"}
          </CloudinaryUploadButton>
          {cover && (
            <button type="button" onClick={() => setCover(null)} className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Remove
            </button>
          )}
        </div>
      </fieldset>

      <div>
        <label htmlFor="p-content" className="block text-sm font-medium">Content *</label>
        <RichTextEditor
          id="p-content"
          value={form.content}
          onChange={(markdown) => setForm((prev) => ({ ...prev, content: markdown }))}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={form.published} onChange={update("published")} className="h-4 w-4 accent-brand" />
          Published on the site
        </label>
        <div className="flex flex-wrap gap-3">
          {!isNew && (
            <button type="button" onClick={remove} disabled={deleting} className={buttonVariants({ variant: "destructive" })}>
              {deleting ? "Deleting…" : "Delete post"}
            </button>
          )}
          <button type="submit" disabled={saving} className={buttonVariants({ variant: "brand" })}>
            {saving ? "Saving…" : isNew ? "Create post" : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PostEditor;
