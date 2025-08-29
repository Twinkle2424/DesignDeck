const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    googleId: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    profilePicture: {
        type: String,
        default: "http://localhost:5000/uploads/default-profile.jpg",
    },
    bannerImage: {
        type: String,
        default: "http://localhost:5000/uploads/default-banner.png",
    },
    bio: { type: String, maxlength: 500 },
    dribbbleProfile: { type: String },
    behanceProfile: { type: String },
    isAdmin: { type: Boolean, default: false },
    lastLogin: { type: Date, default: null },
    isLoggedIn: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
