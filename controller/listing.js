import Listing from "../models/listing.js";

// ================= INDEX =================
export const index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

// ================= NEW LISTING FORM =================

export const newListingForm = (req, res) => {
  res.render("listings/new");
};

// ================= OTHER CONTROLLERS =================

export const showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", " this listing doesn't exist!");
    res.redirect("/listings");
  }
  res.render("listings/show", { listing });
};

// ================= EDIT LISTING =================

export const editListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", " this listing doesn't exist!");
    res.redirect("/listings");
  }

  let originalImage = listing.image.url
  originalImage.replace("/upload", "/upload/w_250")
  res.render("listings/edit", { listing, originalImage });
};

// ================= CREATE LISTING =================

export const createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  if(req.file){
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
  }
  await newListing.save();
  req.flash("success", "Successfully made a new listing!");
  return res.redirect(303, "/listings");
};

// ================= UPDATE LISTING =================

export const updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save()
  }
  req.flash("success", "Successfully updated the listing!");
  res.redirect(`/listings/${id}`);
};

// ================= DELETE LISTING =================

export const deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted a listing!");
  res.redirect("/listings");
};
