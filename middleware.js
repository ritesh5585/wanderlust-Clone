import Listing from "./models/listing.js";
import { ExpressError } from "./utils/ExpressError.js";
import { listingSchema, reviewSchema } from "./schema.js";
import Review from "./models/review.js";

// ================= AUTHENTICATION =================
export const isLoggedIn = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in to create a listing!");
    return res.redirect("/login");
  }
  next();
};

// ================= SAVED REDIRECT URL =================
export const savedRedirectUrl = async (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

// ================= AUTHORIZATION =================
export const isOwner = async (req, res, next) => {
  let { id } = req.params;
  const currentUser = req.user;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", " this listing doesn't exist!");
    return res.redirect("/listings");
  }

  if (!currentUser || !listing.owner._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "You don't have permission to edit this listing!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

// ================= VALIDATION =================
export const validateListing = (req, res, next) => {

  const { error } = listingSchema.validate(req.body);

  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

// ================= VALIDATION =================
export const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};
// ================= REVIEW AUTHOR CHECK =================
export const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review.author.equals(res.locals.currentUser._id)) {
    req.flash("error", " You don't have permission to delete this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
