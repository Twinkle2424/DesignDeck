const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const passport = require("passport");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth"); // Import adminAuth middleware
const jwt = require("jsonwebtoken");

// ✅ Define Admin Emails
const adminEmails = ["harshvekriya441@gmail.com", "ptwinkle837@gmail.com"];

// ✅ Register Route
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Assign Role Based on Email
        const isAdmin = adminEmails.includes(email);
        const role = isAdmin ? "admin" : "user";

        const newUser = new User({ name, email, password: hashedPassword, isAdmin, role });

        await newUser.save();
        res.status(201).json({ 
            message: "User registered successfully", 
            user: { name, email, isAdmin, role } 
        });

    } catch (error) {
        console.error("❌ Register Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Login Route
router.post("/login", async (req, res, next) => {
    passport.authenticate("local", async (err, user, info) => {
        if (err) return res.status(500).json({ message: "Server error" });
        if (!user) return res.status(400).json({ message: info.message });

        req.login(user, async (err) => {
            if (err) return res.status(500).json({ message: "Login failed" });

            req.session.user = user; // ✅ Store user in session

            // ✅ Update Login Details
            const currentTime = new Date();
            await User.findByIdAndUpdate(user._id, { 
                isLoggedIn: true, 
                lastLogin: currentTime 
            });

            // ✅ Set JWT Cookie
            res.cookie("token", jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1d"
            }), { httpOnly: true, sameSite: "lax" });

            req.session.save((err) => {
                if (err) return res.status(500).json({ message: "Session error" });
                res.status(200).json({ 
                    message: "Login successful", 
                    user: {
                        name: user.name,
                        email: user.email,
                        isAdmin: user.isAdmin, // ✅ Ensure isAdmin is returned
                        role: user.isAdmin ? "admin" : "user", // ✅ Correct role assignment
                        lastLogin: currentTime
                    }
                });
            });
        });
    })(req, res, next);
});

// ✅ Get Authenticated User Route
router.get("/me", async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // ✅ Fetch complete user data from MongoDB
        const user = await User.findById(req.user.id).select("-password"); // Exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("User Fetch Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// ✅ Logout Route (Modified to update isLoggedIn)
router.post("/logout", async (req, res) => {
    try {
        let userId = null;
        
        // Try to get user ID from token
        const token = req.cookies.token;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;
            } catch (tokenError) {
                console.error("Token verification error:", tokenError);
                // Continue to try other methods if token verification fails
            }
        }
        
        // If no user ID from token, try to get from session
        if (!userId && req.session && req.session.user) {
            userId = req.session.user._id;
        }
        
        // If we found a user ID, update their login status
        if (userId) {
            await User.findByIdAndUpdate(userId, { isLoggedIn: false });
        }
        
        // Clear cookie
        res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
        
        // Destroy session if it exists
        if (req.session) {
            req.session.destroy((err) => {
                if (err) {
                    console.error("Logout Error:", err);
                    return res.status(500).json({ message: "Logout failed" });
                }
                
                res.status(200).json({ message: "Logged out successfully" });
            });
        } else {
            // If no session exists, just send success response
            res.status(200).json({ message: "Logged out successfully" });
        }
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Logout failed", error: error.message });
    }
});

module.exports = router;