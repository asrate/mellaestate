import Listing from "../models/listing.model.js";
export const createListing = async (req, res, next) => {
  try {
    const {
      name,
      description,
      address,
      reqularPrice,
      duscountPrice,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrls,
      userREF,
    } = req.body;
    const listing = await Listing.create({
      name,
      description,
      address,
      reqularPrice,
      duscountPrice,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrls,
      userREF,
    });
    return res.status(201).json("listing");
  } catch (error) {
    next(error);
  }
};
