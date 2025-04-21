import { Router } from "express";
import Review from "../models/Review.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    res.status(201).json({ message: "Review submitted successfully" });
  } catch (error) {
    console.error("Error in POST /api/reviews:", error);
    res.status(500).json({ error: "Failed to submit review" });
  }
});

router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("Error in GET /api/reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

export default router;
