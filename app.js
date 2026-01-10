import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import path from "path";
import ejsMate from "ejs-mate";
import methodOverride from "method-override";
import cors from "cors";
import { fileURLToPath } from "url";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";

import listingsRouter from "./routes/listing.js";
import reviewsRouter from "./routes/review.js";
import userRouter from "./routes/user.js";
import User from "./models/user.js";
import { ExpressError } from "./utils/ExpressError.js";
import passport from "passport";
import LocalStrategy from "passport-local";

const app = express();

// ================= PATH SETUP (ES MODULE FIX) =================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= DATABASE =================

const dbUrl = process.env.ATLASDB_URL;

// ================= VIEW ENGINE =================

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
// app.use(express.static(path.join(process.cwd(), "public")));
app.set("views", path.join(__dirname, "views"));

// ================= MIDDLEWARE =================

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // middleware to support PUT and DELETE methods

main()
  .then(() => {
    console.log("it's working perfectly")
    })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl, {
    serverSelectionTimeoutMS: 3000
  });
}

// ================= ROUTES =================

// Home (optional)
app.get("/", (req, res) => {
  res.redirect("/listings");
});

//================= SESSION CONFIGURATION =================

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET_CODE,
  },
  touchAfter: 24 * 3600,
});

const sessionOptions = {
  store,
  secret: process.env.SECRET_CODE, 
  resave: false,
  saveUninitialized: true,
  cookies: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

//================= PASSPORT CONFIGURATION =================

app.use(passport.initialize());
app.use(passport.session());

console.log(User.authenticate());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//================= FLASH CONFIGURATION =================

app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ================= ROUTE HANDLERS =================
//Listings Routes
app.use("/listings", listingsRouter);

//Reviews Routes
app.use("/listings/:id/reviews", reviewsRouter);

//User Routes
app.use("/", userRouter);

// ================= ERROR HANDLING =================

// show page not found on wrong routes
app.all("/{*splat}", (req, res, next) => {
  // use /{*splat} instead of *
  next(new ExpressError(404, "page not found"));
});

// ============global error handler===========

// fixed for bypass error to not stop our server
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("error", { error: { message } });
});

// ================= SERVER =================
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
