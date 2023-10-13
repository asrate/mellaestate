import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHander } from "../utils/error.js";

export const test = (req, res) => {
  res.json({ message: "hello world" });
};
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHander(403, "you can only update your own account"));
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hash(req.body.password, 10);
    }
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (req, res, next) => {
  const token = req.headers["authorization"].split(" ").pop();
  if (req.user.id !== req.params.id)
    return next(errorHander(401, "You can only delete your own account"));
  try {
    await User.findByIdAndDelete(req.params.id);
    // res.clearCookie("access_token");

    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};
export const getUserListing = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listing = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listing);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHander(401, "You can only delete your own"));
  }
};
