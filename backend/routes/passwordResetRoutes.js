const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Adjust path as needed
const sendMail = require("../config/nodemailerConfig"); // Adjust path as needed

const router = express.Router();

// ✅ Sent link Route
router.post('/resetpassword', async (req, res) => {
    const { email } = req.body;
    console.log(req.body);

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // ✅ Generate JWT Token (expires in 1 hour)
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // **Force the server to always use port 5173**
    const resetUrl = `http://${req.hostname}:5173/changepasswordwithtoken/${resetToken}`;

    // Send email
    try {
        await sendMail(email, "Password Reset", `Click the link to reset your password: ${resetUrl}`);
        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending email" });
    }
});

// ✅ Change Password Route
router.post('/changepasswordwithtoken', async (req, res) => {
    const { password, token } = req.body;

    if (!password || !token) {
        return res.status(400).json({ message: "Password is required" });
    }
    try {
        // ✅ Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || user.resetPasswordToken !== token || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // ✅ Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // ✅ Clear reset fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        res.status(200).json({ message: "Password reset successful" });

    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Invalid or expired token" });
    }
});

module.exports = router;
