const Listing = require("../models/listing");
const Review = require("../models/review");
module.exports.creatReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Successfully created a new review!");
    res.redirect(`/listings/${req.params.id}`);
  }
 module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;

    // Remove review reference from the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the actual review from the Review model
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted a review!");

    res.redirect(`/listings/${id}`);
  }