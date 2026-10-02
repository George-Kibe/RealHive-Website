import mongoose from "mongoose";
// Create the Comment schema (comments on blog posts; only signed-in users can post)
const CommentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Types.ObjectId,
    ref: 'Post',
    required: true,
    index: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  body: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
}, {
  timestamps: true
});

// Create the Comment model using the schema
const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

export default Comment
