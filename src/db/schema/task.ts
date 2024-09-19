import mongoose from "mongoose";

const TASK_LEVEL = ["Lowest", "Low", "Medium", "Highest"];
const TASK_STATUS = ["Backlog", "Process", "Done"];
const TASK_TYPE = ["Task", "Bug", "Story"];

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 255,
    },
    type: {
      type: String,
      enum: TASK_TYPE,
      required: true,
      default: "Task",
    },
    description: {
      type: String,
    },
    code: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: TASK_LEVEL,
      required: true,
      default: "Medium",
    },
    status: {
      type: String,
      enum: TASK_STATUS,
      required: true,
      default: "Backlog",
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
        required: true,
      },
    ],
    endAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const Task = mongoose.model("Task", taskSchema);
