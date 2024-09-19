import mongoose from "mongoose";

const TOKEN_TYPE = ["Account", "Refresh", "Password"];

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
    isVerifyEmail: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
    tokens: [
      {
        value: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: TOKEN_TYPE,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
