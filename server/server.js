import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from "jsonwebtoken";
import routerContact from './routes/contact.js';
import routerReview from './routes/reviews.js';
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js"
import cookieParser from "cookie-parser";
import User from './model/User.js';

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

connectDB();

// ------------------- Middleware -------------------

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// ------------------- Passport Google Strategy -------------------

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_REDIRECT_URI,
}, async (accessToken, refreshToken, profile, done) => {

  try {
    let user = await User.findOne({ googleId: profile.id })

    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        picture: profile.photos[0].value,
      });
    }
    return done(null, user);
  } catch (error) {
    return done(error, null)
  }
}));

// ------------------- Routes -------------------

// Root route
app.get('/', (req, res) => {
  res.json({
    message: "API is Running"
  });
});

// Google OAuth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.redirect(process.env.VITE_CLIENT_URL);
  }
);

// API routes
app.use("/auth", authRoutes);
app.use('/api/reviews', routerReview);
app.use('/api/contact', routerContact);

// ------------------- MongoDB & Server -------------------

app.listen(port, () => {
  console.log(`Server Running on port ${port}`)
})