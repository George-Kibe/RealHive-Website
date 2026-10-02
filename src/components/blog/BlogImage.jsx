"use client"

import { CldImage } from "next-cloudinary";

/**
 * Cloudinary image with the blog's default transformations: crop to fill the
 * requested aspect ratio around the most interesting region (g_auto), with
 * automatic format (AVIF/WebP) and quality, resized per `sizes` by next/image.
 * Client wrapper because CldImage has no "use client" directive of its own.
 */
const BlogImage = ({ publicId, alt = "", width, height, sizes, priority = false, className = "" }) => (
  <CldImage
    src={publicId}
    alt={alt}
    width={width}
    height={height}
    sizes={sizes}
    preload={priority}
    crop={{ type: "fill", source: true }}
    gravity="auto"
    format="auto"
    quality="auto"
    className={className}
  />
);

export default BlogImage;
