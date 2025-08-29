const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = (req, res, next) => {
  try {
    if (req.session?.user) {
      next();
      return;
    }

    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid token" });

      const user = await User.findById(decoded.userId).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      req.session.user = user;
      next();
    });
  } catch (error) {
    console.error("User Fetch Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }

};