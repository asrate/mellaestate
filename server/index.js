import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routers/user.router.js";
import authRouter from "./routers/auth.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import listingRouter from "./routers/listing.router.js";

dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => console.log(err));
const app = express();
app.use(cors());

// app.use("*", function (req, res, next) {
//   console.log("OPTIONS");
//   if (req.method == "OPTIONS") {
//     res.sendStatus(200);
//   } else next();
// });
app.use(express.json());
app.use(cookieParser());
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("api/listing", listingRouter);

// create a middlware and function to handle possible error
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, (req, res) => {
  console.log("listening on port");
});
