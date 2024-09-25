import { type MemberType, Project, Task, TaskType, type UserType } from "@/db";
import { ApiError } from "@/errors";
import { BaseResponse, randomTaskCode } from "@/helpers";
import { type TaskSchema, profileSchema } from "@/validations";
import mongoose from "mongoose";

const save = async (
  author: UserType,
  projectId: string,
  jsonBody: TaskSchema,
) => {
  const taskCode = randomTaskCode();

  const newTask = await Task.create({
    ...jsonBody,
    code: taskCode,
  });

  await Project.findByIdAndUpdate(
    projectId,
    { $push: { tasks: newTask._id } },
    { new: true, useFindAndModify: false },
  );

  return new BaseResponse<object>(200, newTask);
};

const findAll = async (member: UserType, projectId: string) => {
  const project = await findProjectById(member, projectId);

  return new BaseResponse<object>(200, project.tasks);
};

const findDetail = async (
  member: UserType,
  projectId: string,
  taskId: string,
) => {
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
  projectId: string,
  taskId: string,
  jsonBody: TaskSchema,
) => {
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

const remove = async (author: UserType, projectId: string, taskId: string) => {
  const existingProject = await findProjectById(author, projectId);

  if (!existingProject) throw new ApiError(404, "Project not found!");

  const existingTask = await Task.findById(taskId);

  if (!existingTask) throw new ApiError(404, "Task not found!");

  if (existingTask.reporter.email !== author.email) {
    throw new ApiError(403, "You don't have permission to delete this task!");
  }

  await Task.deleteOne({ _id: taskId });

  return new BaseResponse<string>(200, "Task deleted successfully");
};

const findProjectById = async (user: UserType, projectId: string) => {
  const existingProject = await Project.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(projectId),
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
