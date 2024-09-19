import mongoose from "mongoose";

const CATEGORY_ENUM = ["Software", "Marketing", "Business"];

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 255,
    },
    url: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: CATEGORY_ENUM,
      default: "Software",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Project = mongoose.model("Project", projectSchema);
