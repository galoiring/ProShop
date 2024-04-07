import express from "express";
import passport from "passport";
import { authUser } from "../controllers/userController.js";
const router = express.Router();

// Route for Google OAuth2 authentication
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    req.body.name = req.user.name;
    req.body.email = req.user.email;

    authUser(req, res);
    return res.redirect("http://localhost:3000");
  }
);

export default router;
