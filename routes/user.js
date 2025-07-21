const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware");
const userController = require("../controllers/user");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(userController.signup));

router.get("/login", (req, res) => {
  res.render("users/login.ejs");

});

router.post("/login",
  saveredirectUrl,
  passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
 req.flash("success", "Welcome back!");
 let redirectUrl = res.locals.redirectUrl || "/listings";
 res.redirect(redirectUrl);
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
  });
  req.flash("success", "Goodbye!");
  res.redirect("/listings");
});

module.exports = router;