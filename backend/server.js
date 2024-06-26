import path from "path";
import express from "express";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import passport from "passport";
import "./config/passport.js";
import generateToken from "./utils/generateToken.js";
import session from "express-session";
dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// Configure CORS
app.use(cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res, next) => {
    try {
      // Retrieve user details from the authenticated user object
      const { _id, name, email, isAdmin } = req.user;
      // Generate a JWT token
      const jwtToken = generateToken(res, _id, email, name, isAdmin);
      console.log("Token", jwtToken);

      // Encode URL parameters using encodeURIComponent
      const params = new URLSearchParams({
        token: jwtToken,
      });

      // Construct the redirect URL with encoded parameters
      const redirectUrl =
        process.env.NODE_ENV === "production"
          ? `https://proshopfront.onrender.com/login?${params.toString()}`
          : `http://localhost:3000/login?${params.toString()}`; // Redirect the user to the frontend login page with encoded URL parameters
      // const redirectUrl = `http://localhost:3000/login?${params.toString()}`;
      console.log("redirect URL: ", redirectUrl);
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Error handling Google OAuth2.0 callback:", error);
      res
        .status(500)
        .json({ message: "Error handling Google OAuth2.0 callback", error });
    }
  }
);

app.get("/api/config/paypal", (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use("/uploads", express.static("/var/data/uploads"));
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  const __dirname = path.resolve();
  app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, "0.0.0.0", () =>
  console.log(`Server is running on port ${port}`)
);
