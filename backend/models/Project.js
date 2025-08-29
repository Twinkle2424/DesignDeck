const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    videos: [{ type: String }],
    category: [{ type: String, required: true }],
    likeCount: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // NEW
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
