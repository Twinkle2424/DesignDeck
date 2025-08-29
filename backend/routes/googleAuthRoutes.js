const express = require("express");
const passport = require("passport");
const User = require("../models/User"); // Import User model

const router = express.Router();

// ✅ Admin Email List
const adminEmails = ["harshvekriya441@gmail.com", "ptwinkle837@gmail.com"];

// ✅ Google OAuth Login Route
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })
);

// ✅ Google OAuth Callback Route
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    async (req, res) => {
        console.log("✅ Google Login Success. User:", req.user);

        if (!req.user) {
            return res.redirect("/login"); // Redirect if user data is not found
        }

        const currentTime = new Date();

        try {
            // ✅ Find or Create User
            let user = await User.findOne({ email: req.user.email });

            if (!user) {
                const isAdmin = adminEmails.includes(req.user.email); // Check if admin
                user = new User({
                    name: req.user.displayName,
                    email: req.user.email,
                    isAdmin,
                    isLoggedIn: true,
                    lastLogin: currentTime,
                });
                await user.save();
            } else {
                user.isLoggedIn = true;
                user.lastLogin = currentTime;
                user.isAdmin = adminEmails.includes(user.email); // Ensure isAdmin is updated
                await user.save();
            }

            // Store user in session
            req.session.user = user;
            console.log("✅ Session User:", req.session.user);

            // ✅ Redirect based on user role
            if (user.isAdmin) {
                console.log("🔹 Redirecting to Admin Dashboard");
                return res.redirect("http://localhost:5173/admin-dashboard");
            } else {
                console.log("🔹 Redirecting to User Dashboard");
                return res.redirect("http://localhost:5173/dashboard");
            }
        } catch (error) {
            console.error("❌ Error updating user login status:", error);
            return res.redirect("/error");
        }
    }
);

module.exports = router;
