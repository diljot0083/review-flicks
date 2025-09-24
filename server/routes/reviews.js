import express from 'express';
import Review from '../model/Review.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const routerReview = express.Router();

// POST a new review
routerReview.post('/', verifyToken, async (req, res) => {
  try {
    const { movie, rating, comment, imdbID } = req.body;

    const newReview = new Review({
      movie,
      rating,
      comment,
      imdbID,
      user: req.user.id,
    });

    await newReview.save();

    const populatedReview = await Review.findById(newReview._id).populate('user', 'name email');
    res.status(201).json(populatedReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all reviews
routerReview.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a review
routerReview.delete('/:id', verifyToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('user', '_id');

    if (!review) return res.status(404).json({ message: "Review not found" });

    const reviewUserId = review.user._id.toString();

    if (reviewUserId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// UPDATE a review
routerReview.put('/:id', verifyToken, async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const review = await Review.findById(req.params.id).populate('user', '_id');

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to edit this review" });
    }

    if (comment) review.comment = comment;
    if (rating) review.rating = rating;

    await review.save();
    const updatedReview = await Review.findById(review._id).populate("user", "name email");

    res.json(updatedReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default routerReview;
