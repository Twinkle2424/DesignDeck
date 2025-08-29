const express = require("express");
const User = require("../models/User");
const Project = require("../models/Project");
const router = express.Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const adminAuth = require("../middleware/adminAuth"); // Import adminAuth middleware

// ✅ Admin Dashboard Route
router.get("/admin-dashboard", adminAuth, (req, res) => {
    res.status(200).json({ message: "Welcome Admin!", isAdmin: true });
});

// ✅ Get All Users for Admin Dashboard
router.get("/all-users", adminAuth, async (req, res) => {
    try {
        const users = await User.find().select("name email isLoggedIn lastLogin profilePicture isAdmin");
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ DELETE User by ID (Admin Only)


router.delete("/delete-user/:id", adminAuth, async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the user
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete all projects related to the user
        await Project.deleteMany({ userId: id });

        res.status(200).json({ message: `User with ID ${id} and their projects deleted successfully` });
    } catch (error) {
        console.error("Error deleting user and projects:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// ✅ Admin Send mail to all users

router.post("/send-email", async (req, res) => {
    try {
        const { subject, email } = req.body;

        // Fetch all user emails from the database
        const users = await User.find({}, "email");

        // If no users are found, return an error response
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "No users found in the database." });
        }

        // Extract email addresses
        const emailList = users.map((user) => user.email);

        // If emailList is empty for some reason, return an error
        if (!emailList.length) {
            return res.status(400).json({ success: false, message: "No valid emails found." });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_ID, // Your Gmail
                pass: process.env.MAIL_PASS, // App Password
            },
        });

        // Send emails individually to each user
        for (const user of users) {
            const mailOptions = {
                from: process.env.MAIL_ID, // Sender email
                to: user.email, // Send to the specific user's email
                subject: subject,
                text: email,
            };

            await transporter.sendMail(mailOptions);
            console.log(`Email sent to: ${user.email}`);
        }

        res.status(200).json({ success: true, message: "Emails sent successfully to all users." });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, message: "Failed to send emails.", error: error.message });
    }
});

router.post("/logout", adminAuth, async (req, res) => {
    try {
        const token = req.cookies.token;
        let userId = null;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;
            } catch (tokenError) {
                console.error("Token verification failed:", tokenError);
            }
        }

        // If no user ID from token, try to get from session
        if (!userId && req.session && req.session.user) {
            userId = req.session.user._id;
        }

        if (userId) {
            await User.findByIdAndUpdate(userId, { isLoggedIn: false });
        }

        // Clear the admin auth token
        res.clearCookie("token", { httpOnly: true, sameSite: "lax" });

        if (req.session) {
            req.session.destroy((err) => {
                if (err) {
                    console.error("Session destruction error:", err);
                    return res.status(500).json({ message: "Logout failed" });
                }
                return res.status(200).json({ message: "Admin logged out successfully" });
            });
        } else {
            return res.status(200).json({ message: "Admin logged out successfully" });
        }
    } catch (error) {
        console.error("Admin Logout Error:", error);
        res.status(500).json({ message: "Logout failed", error: error.message });
    }
});

module.exports = router;
