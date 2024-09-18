import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      length: 255,
    },
    firstName: {
      type: String,
      required: true,
      length: 255,
    },
    lastName: {
      type: String,
      required: true,
      length: 255,
    },
    avatar: {
      type: String,
    },
    isVerifyEmail: String,
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
