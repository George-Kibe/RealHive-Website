import mongoose from "mongoose";
// Create the Booking schema: consultation calls booked from /book
const BookingSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true },
  startsAt: { type: Date, required: true }, // UTC
  endsAt: { type: Date, required: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
  company: { type: String, trim: true, maxlength: 100 },
  topic: { type: String, required: true, trim: true, maxlength: 1000 },
  timezone: { type: String, default: "Africa/Nairobi" }, // the visitor's, for showing them times
  status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
  cancelledAt: { type: Date },
  cancelledBy: { type: String, enum: ["visitor", "admin"] },
  // Google Calendar event with the Meet link (lib/booking/google.js); empty when not configured or it failed
  meetLink: { type: String },
  googleEventId: { type: String },
  googleEventLink: { type: String }, // opens the event in Google Calendar
  meetError: { type: String }, // why the Meet link couldn't be created, for the admin panel
  cancelTokenHash: { type: String, index: true }, // sha256 of the token in the visitor's cancel link
  ipHash: { type: String, index: true }, // salted hash, for rate limiting
}, {
  timestamps: true
});

// One confirmed booking per start time. Enforced by the database, so two people
// clicking the same slot at once can't both get it.
BookingSchema.index({ startsAt: 1 }, { unique: true, partialFilterExpression: { status: "confirmed" } });
BookingSchema.index({ email: 1, startsAt: 1 });

// Create the Booking model using the schema
const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

export default Booking
