import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  movie: String,
  rating: Number,
  comment: String,
  imdbID: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
