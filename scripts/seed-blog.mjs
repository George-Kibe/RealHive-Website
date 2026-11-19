/**
 * Seed the blog with sample posts:
 *
 *   npm run seed-blog
 *
 * Uploads each cover in scripts/seed/blog-covers/ to Cloudinary as
 * realhive/blog/seed/<slug> (credentials from CLOUDINARY_URL), then creates or
 * updates the matching post as published, authored by the first admin.
 * Safe to re-run: posts are matched by slug and covers are overwritten.
 *
 * Seeds marked `draft: true` are created unpublished (review and publish them
 * in /admin/blog, which sets the publish date) and, once they exist, are never
 * touched again, so edits made in the admin aren't overwritten.
 *
 * The site caches blog pages for up to an hour, so seeded changes appear after
 * that, on the next deploy, or immediately after any edit in /admin/blog.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import Post from "../src/models/PostModel.js";
import User, { ROLES } from "../src/models/UserModel.js";
import { SEED_POSTS } from "./seed/blog-posts.mjs";

const COVERS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "seed", "blog-covers");
const DAY_MS = 24 * 60 * 60 * 1000;

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

if (!process.env.MONGODB_URI) fail("MONGODB_URI is not set. Add it to .env.local.");
if (!process.env.CLOUDINARY_URL) fail("CLOUDINARY_URL is not set. Add it to .env.local.");

try {
  await mongoose.connect(process.env.MONGODB_URI);
  const admin = await User.findOne({ role: ROLES.ADMIN }).sort({ createdAt: 1 });
  if (!admin) fail("No admin user found. Run `npm run create-admin -- you@example.com` first.");

  let seeded = 0;
  for (const seed of SEED_POSTS) {
    const existing = await Post.findOne({ slug: seed.slug });
    if (existing && seed.draft) {
      console.log(`Skipped  ${seed.slug} (draft already created; edit it in /admin/blog)`);
      continue;
    }
    const upload = await cloudinary.uploader.upload(path.join(COVERS_DIR, `${seed.slug}.png`), {
      public_id: `realhive/blog/seed/${seed.slug}`,
      overwrite: true,
      invalidate: true,
      resource_type: "image",
    });

    const fields = {
      title: seed.title,
      excerpt: seed.excerpt,
      content: seed.content,
      tags: seed.tags,
      coverImage: { publicId: upload.public_id, alt: seed.coverAlt },
      author: admin._id,
      ...(seed.authorSlug ? { authorSlug: seed.authorSlug } : {}),
      published: !seed.draft,
    };
    seeded++;
    if (existing) {
      existing.set(fields);
      await existing.save();
      console.log(`Updated  ${seed.slug}`);
    } else {
      await Post.create({ ...fields, slug: seed.slug, ...(seed.draft ? {} : { publishedAt: new Date(Date.now() - seed.daysAgo * DAY_MS) }) });
      console.log(`Created  ${seed.slug}${seed.draft ? " (draft)" : ""}`);
    }
  }
  console.log(`\nSeeded ${seeded} posts. View them at /blog; drafts are in /admin/blog.`);
} catch (error) {
  fail(`Seeding failed: ${error.message ?? error.error?.message ?? error}`);
} finally {
  await mongoose.disconnect();
}
