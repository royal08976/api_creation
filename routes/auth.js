const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/users");
const router = express.Router();

// ✅ User Registration
router.post("/register", async (req, res) => {
    try {
        let { username, email, password } = req.body;
        email = email.toLowerCase(); // Normalize email

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash password and generate API key
        const hashedPassword = await bcrypt.hash(password, 10);
        const apiKey = uuidv4(); // Generate unique API key

        const user = new User({ username, email, password: hashedPassword, apiKey });
        await user.save();

        res.status(201).json({ 
            success: true, 
            message: "User registered successfully", 
            apiKey 
        });

    } catch (err) {
        console.error("❌ Registration Error:", err);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
});

// ✅ User Login
router.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.toLowerCase();

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare plain password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                apiKey: user.apiKey,
            },
        });

    } catch (err) {
        console.error("❌ Login Error:", err);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
});

// ✅ Protected Route Example
router.get("/protected", authenticate, (req, res) => {
    res.json({ message: "You have accessed a protected route!" });
});

// ✅ Middleware to Authenticate Requests
function authenticate(req, res, next) {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}

module.exports = router;
