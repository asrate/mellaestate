import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    avatar: {
      type: String,
      default:
        "file:///C:/Users/acer/AppData/Local/Temp/8c28209b-46fb-4972-aaac-c4413b9df41f_OnlineWebFonts_COM_Icons_9c7b82729fa6b1d27c29a3ee1087e8b1.zip.41f/account_user_profile_avatar.svg",
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;
