import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  movie: String,
  rating: Number,
  comment: String,
  user: String,
  imdbID: String,
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
