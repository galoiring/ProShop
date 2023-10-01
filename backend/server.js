import express from "express";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import productRoutes from "./routes/productRoutes.js";
import dotenv from "dotenv";
import cors from "cors"; // Import the cors middleware
dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cors()); // Use the cors middleware to allow all origins during development

app.get("/", (req, res) => {
  res.send("API is running ...");
});

app.use("/api/products", productRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, "0.0.0.0", () =>
  console.log(`Server is running on port ${port}`)
);
