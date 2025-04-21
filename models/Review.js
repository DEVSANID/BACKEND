import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: String,
  email: String,
  review: String,
  rating: Number,
}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
