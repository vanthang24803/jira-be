import mongoose, { type Document } from "mongoose";

const ROLE_ENUM = ["Administrator", "Member", "Viewer"];

const memberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    length: 255,
  },
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

export type MemberType = {
  email: string;
  fullName: string;
  avatar: string;
  role: string;
} & Document;

export const Member = mongoose.model("Member", memberSchema);
