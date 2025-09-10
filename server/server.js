import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import routerContact from './routes/contact.js';
import routerReview from './routes/reviews.js';
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js"

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

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// ------------------- Passport Google Strategy -------------------

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_REDIRECT_URI,
}, (accessToken, refreshToken, profile, done) => {

  const user = {
    googleId: profile.id,
    name: profile.displayName,
    email: profile.emails[0].value,
    picture: profile.photos[0].value,
  };

  return done(null, user);
}));
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

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
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log('Logged in user:', req.user); // check console
    res.json(req.user); // see user info in browser
  }
);

// API routes
app.use("/auth", authRoutes);  
app.use('/api/reviews', routerReview);
app.use('/api/contact', routerContact);

// ------------------- MongoDB & Server -------------------

app.listen( port, () => {
  console.log(`Server Running on port ${port}`)
})