import mongoose from "mongoose";
// Create the Post schema (blog posts at /blog, managed from /admin/blog)
const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug may only contain lowercase letters, numbers and hyphens'],
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: 300,
  },
  content: {
    type: String, // Markdown
    required: true,
  },
  coverImage: {
    publicId: { type: String, trim: true }, // Cloudinary public ID
    alt: { type: String, trim: true, maxlength: 200 },
  },
  tags: {
    type: [String],
    default: [],
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  published: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date, // set the first time the post is published
  },
}, {
  timestamps: true
});

// Create the Post model using the schema
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

export default Post
