import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
      maxlength: 255,
    },
    avatar: {
      type: String,
      required: true,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      maxlength: 255,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Member = mongoose.model("Member", memberSchema);
