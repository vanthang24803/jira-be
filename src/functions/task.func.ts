import {
  type MemberType,
  Project,
  Task,
  type TaskType,
  type UserType,
} from "@/db";
import { ApiError } from "@/errors";
import { BaseResponse, randomTaskCode } from "@/helpers";
import type { TaskSchema } from "@/validations";
import mongoose from "mongoose";

const save = async (author: UserType, slug: string, jsonBody: TaskSchema) => {
  await findProjectById(author, slug);

  const taskCode = randomTaskCode();

  const newTask = await Task.create({
    ...jsonBody,
    code: taskCode,
  });

  await Project.findOneAndUpdate(
    {
      url: slug,
    },
    { $push: { tasks: newTask._id } },
    { new: true, useFindAndModify: false },
  );

  return new BaseResponse<object>(200, newTask);
};

const findAll = async (
  member: UserType,
  slug: string,
  query: string | undefined,
) => {
  const project = await findProjectById(member, slug);

  let result = project.tasks;

  if (query) {
    result = result.filter((task: TaskType) =>
      task.name.toLowerCase().includes(query.toLowerCase()),
    );
  }

  return new BaseResponse<object>(200, result);
};

const findDetail = async (taskId: string) => {
  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "members",
        localField: "assignees",
        foreignField: "_id",
        as: "assignees",
      },
    },
  ]);

  return new BaseResponse<object>(200, task[0]);
};

const update = async (
  member: UserType,
  slug: string,
  taskId: string,
  jsonBody: TaskSchema,
) => {
  await findProjectById(member, slug);

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    {
      ...jsonBody,
    },
    { new: true, runValidators: true },
  );

  if (!updatedTask) throw new ApiError(404, "Task not found!");

  return new BaseResponse<string>(200, "Task updated successfully");
};

const remove = async (author: UserType, slug: string, taskId: string) => {
  await findProjectById(author, slug);

  const existingTask = await Task.findById(taskId);

  if (!existingTask) throw new ApiError(404, "Task not found!");

  if (existingTask.reporter.email !== author.email) {
    throw new ApiError(403, "You don't have permission to delete this task!");
  }

  await Task.deleteOne({ _id: taskId });

  return new BaseResponse<string>(200, "Task deleted successfully");
};

const findProjectById = async (user: UserType, slug: string) => {
  const existingProject = await Project.aggregate([
    {
      $match: {
        url: slug,
      },
    },
    {
      $lookup: {
        from: "members",
        localField: "members",
        foreignField: "_id",
        as: "members",
      },
    },
    {
      $lookup: {
        from: "tasks",
        localField: "tasks",
        foreignField: "_id",
        as: "tasks",
      },
    },
  ]);

  if (existingProject.length === 0)
    throw new ApiError(404, "Project not found!");

  const isMember = existingProject[0].members.find(
    (x: MemberType) => x.email === user.email,
  );

  if (!isMember) throw new ApiError(403, "Forbidden");

  return existingProject[0];
};

export { findAll, findDetail, save, update, remove };
