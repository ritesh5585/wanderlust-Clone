import express from "express";
const router = express.Router({ mergeParams: true });


import { wrapAsync } from "../utils/wrapAsync.js";
import { isLoggedIn, validateReview, isReviewAuthor } from "../middleware.js";
import { createReview, deleteReview } from "../controller/review.js";

// ================= ROUTES =================

// CREATE REVIEW
router.post(
  "/",
  validateReview,
  isLoggedIn,
  wrapAsync(createReview)
);

// DELETE REVIEW
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(deleteReview)
);

export default router;
