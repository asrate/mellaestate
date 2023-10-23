import { errorHander } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // console.log(req.headers);
  const token = req.headers["authorization"].split(" ").pop();
  // console.log(token);
  // console.log(token);
  // console.log("****", req.cookies);
  if (!token) return next(errorHander(401, "unauthorized "));
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return next(errorHander(403, "forbidden"));
    }
    req.user = user;
    next();
  });
};
