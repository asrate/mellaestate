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
      bathrooms,
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
      bathrooms,
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
export const getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    // console.log(`Listing ${listing}`);
    if (!listing) return console.log("No listing found");
    res.status(200).json(listing);
  } catch (error) {
    console.error(error);
  }
};
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
