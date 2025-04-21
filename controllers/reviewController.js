const Review = require('../models/Review').default;
const asyncHandler = require('express-async-handler');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find().populate('user', 'name');
  res.json(reviews);
});

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment, targetType, eventId } = req.body;

  const review = new Review({
    user: req.user._id,
    userName: req.user.name,
    rating,
    comment,
    targetType,
    eventId: targetType === 'event' ? eventId : null
  });

  const createdReview = await review.save();
  res.status(201).json(createdReview);
});

// @desc    Get reviews for a specific event
// @route   GET /api/reviews/event/:eventId
// @access  Public
const getEventReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ 
    targetType: 'event', 
    eventId: req.params.eventId 
  }).populate('user', 'name');
  
  res.json(reviews);
});

// @desc    Get website reviews
// @route   GET /api/reviews/website
// @access  Public
const getWebsiteReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ targetType: 'website' })
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .limit(10);
    
  res.json(reviews);
});

module.exports = {
  getReviews,
  createReview,
  getEventReviews,
  getWebsiteReviews
};