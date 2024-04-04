import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import dotenv from "dotenv";
dotenv.config();

console.log("CLIENT_ID:", process.env.CLIENT_ID);
console.log("CLIENT_SECRET:", process.env.CLIENT_SECRET);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, callback) => {
      try {
        // Check if user exists in your database by email
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // If user doesn't exist, create a new user in your database
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            // You might want to set some default values for other fields like password, isAdmin, etc.
          });
        }

        // Generate token for the user
        const token = generateToken(user._id);

        // Pass the user and token to the callback function
        callback(null, { user, token });
      } catch (error) {
        // Handle any errors that occur during the process
        callback(error, null);
      }
    }
  )
);

export default passport;
