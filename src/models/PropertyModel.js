import mongoose from "mongoose";
// Create the Property schema
const PropertySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  video: {
    type: String,
  },
  perks: {
    type: [String],
    default: [],
  },
  amenities: {
    type: [String],
    default: [],
  },
  views: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isStandard: {
    type: Boolean,
    default: false,
  },
  isPromoted: {
    type: Boolean,
    default: false,
  },
  isPremiumPromoted: {
    type: Boolean,
    default: false,
  },
  published: {
    type: Boolean,
    default: false,
  },
  area: {
    type: Number,
    required: true,
  },
  contactNumber: {
    type: String,
  },
  contactEmail: {
    type: String,
  },
  priceType: {
    type: String,
  },
  oldPrice: {
    type: Number,
  },
  newPrice: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  reviews: [{
    type: mongoose.Types.ObjectId,
    ref: 'Review',
  }],
}, {
  timestamps: true 
});

// Create the Property model using the schema
const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

export default Property