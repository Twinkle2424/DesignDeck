const express = require('express');
const router = express.Router();
const upload = require("../config/upload");
const User = require("../models/User");
const authMiddleware = require("../middleware/currentUserMiddleware");

router.post("/updateprofile", authMiddleware, upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]), async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log('Image uploaded successfully');

    // ✅ If no new image is uploaded, keep old image
    const profileImageUrl = req.files.profileImage
      ? `http://localhost:${process.env.PORT || 5000}/uploads/profileImages/${req.files.profileImage[0].filename}`
      : user.profilePicture;  // Keep old profile picture

    const coverImageUrl = req.files.coverImage
      ? `http://localhost:${process.env.PORT || 5000}/uploads/coverImages/${req.files.coverImage[0].filename}`
      : user.bannerImage;  // Keep old cover image

    const { bio, dribbbleProfile, behanceProfile } = req.body;

    // ✅ If no new value is provided, keep the old value
    user.bio = bio || user.bio;
    user.dribbbleProfile = dribbbleProfile || user.dribbbleProfile;
    user.behanceProfile = behanceProfile || user.behanceProfile;
    user.profilePicture = profileImageUrl;
    user.bannerImage = coverImageUrl;

    await user.save(); // ✅ Save updated data to MongoDB

    console.log('MongoDB updated for profile change');

    res.json({ message: "Profile updated successfully!", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

module.exports = router;
