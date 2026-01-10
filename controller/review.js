import Listing from "../models/listing.js";
import Review from "../models/review.js";
import { ExpressError } from "../utils/ExpressError.js";

// ================= CREATE REVIEW =================
export const createReview = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/listings");
  }

  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success", "Successfully created a new review!");
  res.redirect(`/listings/${id}`);
};
// ================= DELETE REVIEW =================
export const deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted a review!");
  res.redirect(`/listings/${id}`);
};
