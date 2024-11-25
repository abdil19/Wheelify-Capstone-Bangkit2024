import express from "express";
import { classifyVehicle, fetchNews } from "./handler.js";

const router = express.Router();

// Routes for vehicle classification
router.post("/classify", classifyVehicle);

// Routes for news
router.get("/news", fetchNews);

export default router;
