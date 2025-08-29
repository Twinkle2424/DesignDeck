const User = require("../models/User"); // Import User model

const adminAuth = async (req, res, next) => {
    try {
        if (req.user && req.user.email === "harshvekriya441@gmail.com" || "ptwinkle837@gmail.com") {
            // ✅ Only update `isAdmin` if it's not already true
            const adminUser = await User.findOne({ email: req.user.email });

            if (!adminUser.isAdmin) {
                await User.findOneAndUpdate(
                    { email: req.user.email },
                    { isAdmin: true }
                );
            }

            req.user.isAdmin = true; // ✅ Ensure request object is updated too
            next();
        } else {
            return res.status(403).json({ message: "Access Denied" });
        }
    } catch (error) {
        console.error("Admin Auth Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = adminAuth;
