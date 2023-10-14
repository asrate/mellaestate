import Listing from "../models/listing.model.js";
import { errorHander } from "../utils/error.js";
export const createListing = async (req, res, next) => {
  try {
    const {
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrls,
      userRef,
    } = req.body;
    const listing = await Listing.create({
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrls,
      userRef,
    });
    return res.status(201).json(listing);
  } catch (error) {
    console.log(error);
  }
};
export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHander(401, "Listing not found"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHander(401, "you can only delete your own listing"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted");
  } catch (error) {
    next(error);
  }
};
export const updateListing = async (req, res, next) => {
  //check the listing exists fro database
  const listing = Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHander(404, "Listing not found"));
  }
  if (req.user._id !== listing.userRef) {
    return next(errorHander(404, "you can only update your own list"));
  }
  try {
    const updateListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updateListing);
  } catch (error) {
    next(error);
  }
};
