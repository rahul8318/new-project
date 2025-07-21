if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;
const path = require("path");
const methodOverride = require("method-override");
const ejsMat = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const listingRoutes = require("./routes/listing"); // Import listing routes
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user");
// Import review routes
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMat);
app.use(express.static(path.join(__dirname, "/public")));

// MongoDB connection

const dbUrl = process.env.ATLESDB_URL;
main()
  .then((res) => {
    console.log("Connection complete");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600, // time period in seconds
  crypto: {
    secret : "mysupersecretcode"
  }
});
store.on("error", function (e) {
  console.log("Session Store Error", e);
});

const sessionOptions = {
  store: store,
  secret:"mysupersecretcode",
  resave: false,
 saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};



app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// app.get("/", (req, res) => {
//   res.render("index.ejs");
// });

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// Use routes
app.use("/listings", listingRoutes); // Mount the listing routes
app.use("/listings", reviewRoutes); // Mount the review routes
app.use("/", userRoutes); // Mount the user routes
// Error Handling for Invalid Routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

//home route


// Start the server
app.listen(PORT, () => {
  console.log("Server is listening on Port 3000");
});
