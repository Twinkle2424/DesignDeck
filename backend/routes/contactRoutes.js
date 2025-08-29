const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

router.post("/send-email", async (req, res) => {
    const { name, email, message } = req.body;

    // Nodemailer transporter setup
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_ID, // Your Gmail
            pass: process.env.MAIL_PASS, // App Password
        },
    });

    const mailOptions = {
        from: email,
        to: process.env.MAIL_ID, // Your email to receive messages
        subject: `New Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "Your message has been sent successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send message. Please try again." });
    }
});

module.exports = router;
