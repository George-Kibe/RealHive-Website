"use client"

import { CldImage } from "next-cloudinary";

/**
 * A testimonial photo from Cloudinary: cropped to a square around the face
 * (c_thumb,g_face), with automatic format and quality. Client wrapper because
 * CldImage ships without a "use client" directive.
 */
const TestimonialAvatar = ({ publicId, size = 40, className = "" }) => (
  <CldImage
    src={publicId}
    alt=""
    width={size}
    height={size}
    // a plain "thumb" crop gives c_thumb,g_face in one step; the { type, source: true }
    // form adds a c_limit step that Cloudinary rejects in combination with g_face (400)
    crop="thumb"
    gravity="face"
    format="auto"
    quality="auto"
    className={`rounded-full object-cover ${className}`}
  />
);

export default TestimonialAvatar;
