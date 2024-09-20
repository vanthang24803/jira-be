import mongoose, { type Document } from "mongoose";

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

export type UserType = {
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  isVerifyEmail: boolean;
  password: string;
  tokens: {
    value: string;
    type: string;
  }[];
} & Document;

export const User = mongoose.model<UserType>("User", userSchema);
