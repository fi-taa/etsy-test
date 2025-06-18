import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import listingRoutes from "./routes/listings.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/listings", listingRoutes);

export default app;
