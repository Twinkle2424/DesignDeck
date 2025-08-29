const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ Follow a user
router.put("/follow/:id", async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.id;

    if (currentUserId.toString() === targetUserId) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (targetUser.followers.includes(currentUserId)) {
      return res.status(400).json({ message: "Already following this user." });
    }

    targetUser.followers.push(currentUserId);
    currentUser.following.push(targetUserId);

    await targetUser.save();
    await currentUser.save();

    res.status(200).json({ message: "Followed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Unfollow a user
router.put("/unfollow/:id", async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.id;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!targetUser.followers.includes(currentUserId)) {
      return res.status(400).json({ message: "You are not following this user." });
    }

    targetUser.followers.pull(currentUserId);
    currentUser.following.pull(targetUserId);

    await targetUser.save();
    await currentUser.save();

    res.status(200).json({ message: "Unfollowed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get followers list
router.get("/:id/followers", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("followers", "name profilePicture");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user.followers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get following list
router.get("/:id/following", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("following", "name profilePicture");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user.following);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get('/:id/is-following', async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const isFollowing = targetUser.followers.includes(req.user.id);
    res.json({ isFollowing });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
