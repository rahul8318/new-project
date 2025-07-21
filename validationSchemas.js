const Joi = require("joi");

// Joi schema for validating the Listing model
const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required().min(3).max(100).messages({
      "string.empty": "Title is required",
      "string.min": "Title must be at least 3 characters long",
      "string.max": "Title cannot exceed 100 characters",
    }),
    description: Joi.string().required().min(10).max(1000).messages({
      "string.empty": "Description is required",
      "string.min": "Description must be at least 10 characters long",
      "string.max": "Description cannot exceed 1000 characters",
    }),
    image: Joi.object({
      url: Joi.string().uri().allow("").messages({
        "string.uri": "Invalid image URL format",
      }),
      filename: Joi.string().allow(""),
    }).required(),
    
    price: Joi.number().required().min(0).messages({
      "number.base": "Price must be a number",
      "number.min": "Price cannot be negative",
    }),
    location: Joi.string().required().messages({
      "string.empty": "Location is required",
    }),
    country: Joi.string().required().messages({
      "string.empty": "Country is required",
    }),
  }).required(),
});

module.exports = { listingSchema };


// Review Schema

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});