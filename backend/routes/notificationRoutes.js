const express = require("express");
const Notification = require("../models/Notification");
const adminAuth = require("../middleware/adminAuth"); // Import adminAuth middleware
const router = express.Router();

// User fetches notifications
router.get("/user-notifications", async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin sends a notification (Protected)
router.post("/admin-notifications", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).json({ success: false, message: "Message cannot be empty!" });
        }

        // Save notification in the database
        const newNotification = new Notification({
            message,
            createdAt: new Date(),
        });

        await newNotification.save();

        res.status(201).json({
            success: true,
            message: "Notification sent successfully!",
            data: newNotification,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
});

// Admin Notification Page Access Route (Protected)
router.get("/admin-page", adminAuth, (req, res) => {
    res.json({ message: "Welcome to the Admin Notification Page!" });
});

module.exports = router;
