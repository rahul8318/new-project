// routes/review.js
const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const { reviewSchema } = require("../validationSchemas");
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewsController = require("../controllers/review");



// Middleware for validating reviews
const validateReviewSchema = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

// Post Review
router.post(
  "/:id/reviews",
  isLoggedIn,
  validateReviewSchema,
  wrapAsync(reviewsController.creatReview)
);

// Delete Review
router.delete(
  "/:id/reviews/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewsController.deleteReview)
);

module.exports = router;
