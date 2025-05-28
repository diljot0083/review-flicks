import express from 'express';
import Review from '../model/Review.js';

const routerReview = express.Router();

// POST a new review
routerReview.post('/', async (req, res) => {
  try {
    console.log("Incoming Review:", req.body);

    const newReview = new Review(req.body);
    await newReview.save();

    console.log("Saved Review:", newReview);
    res.status(201).json(newReview);
  } catch (err) {
    console.error('Error saving review:', err);
    res.status(500).json({ message: err.message });
  }
});


// GET all reviews
routerReview.get('/', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

routerReview.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting review', error: err });
  }
});


export default routerReview;
