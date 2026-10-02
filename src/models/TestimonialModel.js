import mongoose from "mongoose";
// Create the Testimonial schema (client quotes shown on /services, managed from /admin/testimonials)
const TestimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  role: {
    type: String, // job title, e.g. "CTO"
    trim: true,
    maxlength: 100,
  },
  company: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  quote: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  avatarPublicId: {
    type: String, // Cloudinary public ID of the person's photo (uploaded from the admin panel)
    trim: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number, // lower numbers show first
    default: 0,
  },
}, {
  timestamps: true
});

// Create the Testimonial model using the schema
const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);

export default Testimonial
