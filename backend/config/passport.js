const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../models/User"); // ✅ Import User Model
const bcrypt = require("bcryptjs");
require("dotenv").config();
const LocalStrategy = require("passport-local").Strategy;

// ✅ Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/auth/google/callback", // ✅ Must match Google Console
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    user = new User({
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        role: profile.emails[0].value === "harshvekariya441@gmail.com" || "ptwinkle837@gmail.com" ? "admin" : "user", // Assign admin role if email matches
                    });
                    await user.save();
                }
                req.session.user = user;

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);
passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) return done(null, false, { message: "User not found" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return done(null, false, { message: "Incorrect password" });
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id); // ✅ Store user ID in session
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).select("-password"); // ✅ Fetch user from DB
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
