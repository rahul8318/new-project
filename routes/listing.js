// routes/listing.js
const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema } = require("../validationSchemas");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn } = require("../middleware.js"); 
const listingsController = require("../controllers/listings");  
const multer = require("multer");
const { storage } = require("../clouConfig.js"); // ✅ Destructure 'storage' from your config

const upload = multer({ storage }); 


// Middleware for validating listings
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

// Index Route
router.get(
  "/",
  wrapAsync(listingsController.index) // Use the controller method for index
);

// New Route
router.get(
  "/new",isLoggedIn,
    wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
  })
);

// Create Route with Validation
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image][url]"), // 1. Upload image first
  (req, res, next) => {
    // 2. Inject image data into req.body.listing before validation
    if (!req.body.listing) req.body.listing = {};

    if (req.file) {
      req.body.listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    next(); // 3. Move on to validation
  },
  validateListing, // 4. Validate complete data
  wrapAsync(async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename }; // 5. Set image data
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
  })
);


// Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
      path: "reviews",
      populate: {
        path: "author",
      }
    }).populate("owner");
    res.render("listings/show.ejs", { listing });
  })
);

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Cannot find that listing!");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// Update Route with Validation
router.put(
  "/:id",
  isLoggedIn,
  upload.single("listing[image][url]"), // ✅ flat name
  (req, res, next) => {
    if (!req.body.listing) req.body.listing = {};

    // If file uploaded, attach it to req.body.listing
    if (req.file) {
      req.body.listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    next();
  },
  validateListing, // ✅ validate after image is added
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
  })
);


// Delete Route
router.delete(
  "/:id",
  isLoggedIn, 
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
  })
);

module.exports = router;
