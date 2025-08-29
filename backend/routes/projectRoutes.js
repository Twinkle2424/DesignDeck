const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User"); // Import User model
const uploadProject = require("../config/uploadProject"); // Import Multer configuration
const Project = require("../models/Project");
const nodemailer = require("nodemailer"); // Import nodemailer for sending emails
const authMiddleware = require("../middleware/currentUserMiddleware"); // Import authentication middleware

// ✅ Route to upload a new project with images & videos
router.post("/upload", authMiddleware, uploadProject.fields([
    { name: "projectImage", maxCount: 10 },
    { name: "projectVideo", maxCount: 10 },
]), async (req, res) => {
    try {

        if (!req.files || (!req.files["projectImage"] && !req.files["projectVideo"])) {
            return res.status(400).json({ message: "Files are missing!" });
        }

        const { title, description, category } = req.body;
        if (!title || !description || !category) {
            return res.status(400).json({ message: "Title and description are required" });
        }

        const newProject = new Project({
            title,
            description,
            category,
            images: req.files["projectImage"] ? req.files["projectImage"].map(file => `/uploads/projects/images/${file.filename}`) : [],
            videos: req.files["projectVideo"] ? req.files["projectVideo"].map(file => `/uploads/projects/videos/${file.filename}`) : [],
            userId: req.user._id,
        });

        await newProject.save();

        res.status(200).json({ message: "Project uploaded successfully!", project: newProject });
    } catch (err) {
        console.error("Error uploading project:", err);
        res.status(500).json({ message: "Error uploading project" });
    }
});

// Route to get all projects of the authenticated user
router.get("/user-projects", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;  // Extract user ID from JWT

        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        // Fetch projects where the user field contains the userId
        const projects = await Project.find({ userId: userId });

        if (projects.length === 0) {
            return res.status(200).json({ success: true, projects: [] });
        }

        // Return complete project objects
        res.status(200).json({ success: true, projects });
    } catch (error) {
        console.error("Error fetching user projects:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Add a new route to get a specific project by ID
router.get("/project/:id", async (req, res) => {
    try {
        const projectId = req.params.id;

        // Find the project by ID
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        // Find the owner's information
        const user = await User.findById(project.userId, 'name profilePicture');

        // Return project with owner information
        res.status(200).json({
            success: true,
            project: {
                ...project._doc,
                owner: user
            }
        });
    } catch (error) {
        console.error("Error fetching project details:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


// Fetch all projects and shuffle them randomly
router.get("/all-projects", async (req, res) => {
    try {
        const { category } = req.query;
        const sessionKey = category ? `shuffled_${category}` : "shuffled_all";

        // Fetch all projects
        let projects = await Project.find({})
            .populate("userId", "name profilePicture")
            .exec();

        // 🔧 Auto-fix improperly stored categories like ["Web Design,App Design"]
        projects.forEach(async (project) => {
            if (
                Array.isArray(project.category) &&
                project.category.length === 1 &&
                project.category[0].includes(",")
            ) {
                const fixed = project.category[0].split(",").map((c) => c.trim());
                project.category = fixed;
                await project.save();
            }
        });

        // 🔍 Category Filter
        let filteredProjects = projects;
        if (category && category !== "All") {
            filteredProjects = projects.filter((project) => {
                return Array.isArray(project.category) &&
                    project.category.find(
                        (cat) => cat.trim().toLowerCase() === category.trim().toLowerCase()
                    );
            });
        }

        // 🌀 Shuffle and store order in session
        if (!req.session[sessionKey]) {
            filteredProjects = filteredProjects.sort(() => Math.random() - 0.5);
            req.session[sessionKey] = filteredProjects.map((p) => p._id.toString());
        } else {
            const orderMap = {};
            req.session[sessionKey].forEach((id, index) => {
                orderMap[id] = index;
            });

            filteredProjects.sort((a, b) => {
                const idA = a._id.toString();
                const idB = b._id.toString();
                if (orderMap[idA] === undefined) return 1;
                if (orderMap[idB] === undefined) return -1;
                return orderMap[idA] - orderMap[idB];
            });
        }

        res.status(200).json({ success: true, projects: filteredProjects });
    } catch (error) {
        console.error("❌ Error fetching projects:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        // Using populate to get the user data along with the project
        // This assumes your Project model has a userId field referencing the User model
        const project = await Project.findById(req.params.id)
            .populate({
                path: 'userId',
                select: 'name profilePicture title' // Select the user fields you need
            });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Return the project with success flag
        return res.json({
            success: true,
            project
        });
    } catch (error) {
        console.error('Error fetching project details:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching project details',
            error: error.message
        });
    }
});

// Get user profile by ID
router.get('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Validate if userId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID format' });
        }

        const user = await User.findById(userId)
            .select('-password -resetPasswordToken -resetPasswordExpires -__v')

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching user profile'
        });
    }
});

// Get projects by user ID
router.get('/projects/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Validate if userId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID format' });
        }

        const projects = await Project.find({ userId: userId })
            .sort({ createdAt: -1 }) // Sort by newest first
            .populate('userId', 'name profilePicture');

        res.json({
            success: true,
            projects
        });
    } catch (error) {
        console.error("Error fetching user projects:", error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching user projects'
        });
    }
});

// Like/Unlike a project
router.post("/like/:projectId", async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user._id;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const hasLiked = project.likedBy.includes(userId);

        if (hasLiked) {
            // Unlike
            project.likedBy.pull(userId);
            project.likeCount -= 1;
        } else {
            // Like
            project.likedBy.push(userId);
            project.likeCount += 1;
        }

        await project.save();

        return res.status(200).json({
            success: true,
            liked: !hasLiked,
            likeCount: project.likeCount,
        });

    } catch (error) {
        console.error("Toggle Like Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

// Get like status for a user
router.get("/like/:projectId", async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user._id;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const liked = project.likedBy.includes(userId);

        return res.status(200).json({
            success: true,
            liked,
            likeCount: project.likeCount,
        });

    } catch (error) {
        console.error("Check Like Status Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});


// Create email transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_ID, // Using your existing env variable
        pass: process.env.MAIL_PASS // Using your existing env variable
    }
});

// Verify transporter configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error('SMTP connection error:', error);
    } else {
        console.log('SMTP server is ready to send messages');
    }
});

// Contact route with authentication middleware
router.post("/users/contact", async (req, res) => {
    try {
        const { recipientId, subject, message, projectDetails, timeline, budget } = req.body;

        // Find the sender (current logged-in user)
        const sender = await User.findById(req.user.id).select("-password");

        // Find the recipient
        const recipient = await User.findById(recipientId);

        if (!recipient || !recipient.email) {
            return res.status(404).json({
                success: false,
                message: "Recipient not found or has no email address"
            });
        }

        // Simple email content with plain text or minimal HTML
        const mailOptions = {
            from: `"DesignDeck"`,
            to: recipient.email,
            subject: subject || `New message from ${sender.name} on DesignDeck`,
            text: `
  New Contact Request from DesignDeck
  
  From: ${sender.name}
  
  Message: ${message}
  
  Project Details:
  Description: ${projectDetails || 'Not provided'}
  Timeline: ${timeline || 'Not specified'}
  Budget: ${budget ? `$${budget}` : 'Not specified'}
  
  You can reply directly to the sender at: ${sender.email}
  
  This message was sent through DesignDeck. Please do not reply to this email.
        `
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: "Message sent successfully"
        });

    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
            success: false,
            message: "Error sending message",
            error: error.message
        });
    }
});

module.exports = router;
