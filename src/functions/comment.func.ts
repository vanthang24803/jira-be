import { Comment, Task, type UserType } from "@/db";
import { ApiError } from "@/errors";
import { BaseResponse } from "@/helpers";
import type { CommentSchema } from "@/validations/comment.validation";
import mongoose from "mongoose";

const createComment = async (
  author: UserType,
  taskId: string,
  jsonBody: CommentSchema,
) => {
  const existingTask = await Task.findById(taskId);

  if (!existingTask) {
    throw new Error("Task not found");
  }

  const newComment = await Comment.create({
    content: jsonBody.content,
    author: `${author.firstName} ${author.lastName}`,
    avatar: author.avatar,
  });

  existingTask.comments.push(newComment._id);

  await existingTask.save();

  return new BaseResponse<string>(201, "Comment created successfully!");
};

const updateComment = async (
  author: UserType,
  taskId: string,
  commentId: string,
  jsonBody: CommentSchema,
) => {
  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      content: jsonBody.content,
      author: `${author.firstName} ${author.lastName}`,
      avatar: author.avatar,
    },
    { new: true },
  );

  if (!updatedComment) {
    throw new Error("Comment not found");
  }

  return new BaseResponse<string>(200, "Updated comment successfully!");
};

const findAllComments = async (taskId: string) => {
  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "comments",
        foreignField: "_id",
        as: "comments",
      },
    },
  ]);

  if (task.length === 0) throw new ApiError(404, "Task not found!");

  return new BaseResponse(200, task[0].comments);
};

const findOneComment = async (taskId: string, commentId: string) => {
  if (
    !mongoose.Types.ObjectId.isValid(taskId) ||
    !mongoose.Types.ObjectId.isValid(commentId)
  ) {
    throw new ApiError(400, "Invalid task or comment ID");
  }

  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "comments",
        foreignField: "_id",
        as: "comments",
      },
    },
    {
      $unwind: "$comments",
    },
    {
      $match: {
        "comments._id": new mongoose.Types.ObjectId(commentId),
      },
    },
  ]);

  if (task.length === 0) throw new ApiError(404, "Comment not found!");

  return new BaseResponse(200, task[0].comments);
};

const removeComment = async (
  author: UserType,
  taskId: string,
  commentId: string,
) => {
  const deletedComment = await Comment.findByIdAndDelete(commentId);

  if (!deletedComment) {
    throw new Error("Comment not found");
  }

  return new BaseResponse<string>(200, "Deleted Comment Successfully!");
};

export {
  createComment,
  findAllComments,
  findOneComment,
  updateComment,
  removeComment,
};
