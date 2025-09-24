import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

const router = express.Router();
// Signup
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ message: "User already exist" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(201).json({ message: "User registered successfully", token, newUser });
    } catch (error) {
        res.status(500).json({ error: "Server Error" })
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({ message: "Login Successfully", token, user });
    } catch (error) {
        res.status(500).json({ error: "Server Error" })
    }
});

// Logout
router.get("/logout", (req, res) => {
    // Clear the cookie
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
});

// Get Current User
router.get("/me", async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.json({ success: false, message: "Not authenticated" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("picture");
        if (!user) return res.json({ success: false, message: "User not found" });

        res.json({ success: true, user });
    } catch (err) {
        return res.json({ success: false, message: "Invalid or expired token" });
    }
});

export default router;