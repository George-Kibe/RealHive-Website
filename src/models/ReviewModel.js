import mongoose from "mongoose";
// Create the Review schema
const ReviewSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  stars: {
    type: Number,
    min: 0,
    max: 5, 
    default: 0,
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  property: {
    type: mongoose.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  reviewerStatus: {
    type: String, // like current tenant or former or neighbor
  }
}, {
  timestamps: true
});

// Create the Review model using the schema
const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

export default Review
