import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import routerContact from './routes/contact.js';
import routerReview from './routes/reviews.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());

// Optional root route
app.get('/', (req, res) => {
  res.json({
    message: "API is Running"
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(5000, () => console.log('Server is Running'));
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Use the routes
app.use('/api/reviews', routerReview);
app.use('/api/contact', routerContact);
