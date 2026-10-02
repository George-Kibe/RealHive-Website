import mongoose from "mongoose";
// Create the Quote schema (estimates emailed from /quote; doubles as a sales lead list in /admin/quotes)
const QuoteSchema = new mongoose.Schema({
  reference: {
    type: String,
    required: true,
    unique: true,
  },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
  company: { type: String, trim: true, maxlength: 100 },
  notes: { type: String, trim: true, maxlength: 1000 },
  country: { type: String }, // ISO 3166-1 alpha-2 from IP geolocation; empty when it couldn't be detected
  countryDetected: { type: Boolean, default: false },
  tier: { type: String, required: true },
  buildLevel: { type: String, required: true },
  selection: { type: mongoose.Schema.Types.Mixed, required: true }, // normalized choices
  items: [{
    _id: false,
    serviceId: String,
    name: String,
    details: String,
    monthly: Boolean,
    from: Number, // in `currency`
    fromUsd: Number,
    weeks: Number,
  }],
  projectFrom: { type: Number, required: true }, // in `currency`, as the visitor saw it
  monthlyFrom: { type: Number, default: 0 },
  projectFromUsd: { type: Number },
  monthlyFromUsd: { type: Number },
  exchangeRate: { type: Number, default: 1 }, // USD -> currency at the time of the quote
  weeksFrom: { type: Number, default: 0 },
  currency: { type: String, default: "USD" },
  ipHash: { type: String, index: true }, // salted hash, for rate limiting
}, {
  timestamps: true
});

QuoteSchema.index({ email: 1, createdAt: -1 });

// Create the Quote model using the schema
const Quote = mongoose.models.Quote || mongoose.model('Quote', QuoteSchema);

export default Quote
