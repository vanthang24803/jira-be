import mongoose from "mongoose";

const ROLE_ENUM = ["Administrator", "Member", "Viewer"];

const memberSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    maxlength: 255,
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
    enum: ROLE_ENUM,
    default: "Member",
    required: true,
  },
});

export const Member = mongoose.model("Member", memberSchema);
