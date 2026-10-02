import { cache } from "react";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/db/connectDB";
import Post from "@/models/PostModel";
import "@/models/UserModel"; // registers the User model for populate()
import { slugify } from "@/lib/slugify";

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_TAGS = 10;

export const readingMinutes = (markdown = "") =>
    Math.max(1, Math.round(markdown.trim().split(/\s+/).length / 220));

/**
 * Pick and validate the fields an admin may set on a post, so request bodies
 * can't write author, timestamps, etc. Throws an Error with a user-facing
 * message on invalid input. `partial` is for updates, where every field is optional.
 */
export const pickPostFields = (body = {}, { partial = false } = {}) => {
    const fields = {};
    if (body.title !== undefined) fields.title = String(body.title).trim();
    if (body.slug !== undefined) fields.slug = String(body.slug).trim().toLowerCase();
    if (body.excerpt !== undefined) fields.excerpt = String(body.excerpt).trim();
    if (body.content !== undefined) fields.content = String(body.content);
    if (body.published !== undefined) fields.published = Boolean(body.published);
    if (body.tags !== undefined) {
        const tags = Array.isArray(body.tags) ? body.tags : String(body.tags).split(",");
        fields.tags = [...new Set(tags.map((t) => String(t).trim()).filter(Boolean))].slice(0, MAX_TAGS);
    }
    if (body.coverImage !== undefined) {
        const publicId = String(body.coverImage?.publicId ?? "").trim();
        fields.coverImage = publicId
            ? { publicId, alt: String(body.coverImage?.alt ?? "").trim().slice(0, 200) }
            : { publicId: undefined, alt: undefined };
    }

    if (!partial || "title" in fields) {
        if (!fields.title) throw new Error("Title is required");
    }
    if (!partial || "content" in fields) {
        if (!fields.content?.trim()) throw new Error("Content is required");
    }
    if (!partial && !fields.slug) fields.slug = slugify(fields.title);
    if ("slug" in fields && !SLUG_PATTERN.test(fields.slug)) {
        throw new Error("Slug may only contain lowercase letters, numbers and hyphens");
    }
    return fields;
};

const serializePost = (post) => ({
    _id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    content: post.content,
    coverImage: post.coverImage?.publicId ? { publicId: post.coverImage.publicId, alt: post.coverImage.alt ?? "" } : null,
    tags: post.tags ?? [],
    author: post.author?.username ?? null,
    published: post.published,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    updatedAt: post.updatedAt.toISOString(),
});

// published posts for the public site, newest first; [] if the database is unreachable
export const getPublishedPosts = async () => {
    try {
        await connectDB();
        const posts = await Post.find({published: true})
            .sort({publishedAt: -1})
            .select("-content")
            .populate("author", "username")
            .lean();
        return posts.map((p) => serializePost({...p, content: ""}));
    } catch (error) {
        console.log("Error loading posts: ", error.message);
        return [];
    }
};

// one published post by slug, or null. cache() dedupes the call between generateMetadata and the page.
export const getPublishedPostBySlug = cache(async (slug) => {
    if (!SLUG_PATTERN.test(slug)) return null;
    try {
        await connectDB();
        const post = await Post.findOne({slug, published: true}).populate("author", "username").lean();
        return post ? serializePost(post) : null;
    } catch (error) {
        console.log("Error loading post: ", error.message);
        return null;
    }
});

// rebuild the blog pages affected by a change to the given slugs
export const revalidateBlog = (...slugs) => {
    revalidatePath("/blog");
    for (const slug of new Set(slugs.filter(Boolean))) revalidatePath(`/blog/${slug}`);
    revalidatePath("/sitemap.xml");
};
