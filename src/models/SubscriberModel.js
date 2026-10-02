import mongoose from "mongoose";
// Create the Subscriber schema (newsletter sign-ups from the homepage)
const SubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  unsubscribedAt: {
    type: Date,
  },
}, {
  timestamps: true
});

// Create the Subscriber model using the schema
const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema);

export default Subscriber
