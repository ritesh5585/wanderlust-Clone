import express from "express";
import multer from "multer";

import { wrapAsync } from "../utils/wrapAsync.js";
import { isLoggedIn, isOwner, validateListing } from "../middleware.js";
import { storage } from "../cloudConfig.js";

import {
  index,
  newListingForm,
  editListing,
  showListing,
  createListing,
  updateListing,
  deleteListing,
} from "../controller/listing.js";

const router = express.Router();
const upload = multer({ storage });

// ================= ROUTES =================
// new route
router.get("/new", isLoggedIn, newListingForm);

// index route
router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isLoggedIn,
    upload.single("image"),
    validateListing,
    wrapAsync(createListing)
  );

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editListing));

router
  .route("/:id")
  .get(wrapAsync(showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(deleteListing));

export default router;
