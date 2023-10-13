import Listing from "../models/listing.model.js";
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
