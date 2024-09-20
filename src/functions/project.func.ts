import { Member, type MemberType, Project, type UserType } from "@/db";
import { ApiError } from "@/errors";
import { BaseResponse } from "@/helpers";
import type { ProjectSchema } from "@/validations";
import mongoose from "mongoose";

const save = async (author: UserType, jsonBody: ProjectSchema) => {
  const member = await Member.create({
    email: author.email,
    avatar: author.avatar,
    fullName: `${author.firstName} ${author.lastName}`,
    role: "Administrator",
  });

  const newProject = await Project.create({
    ...jsonBody,
    createdBy: [author.id],
    members: [member.id],
  });

  return new BaseResponse<object>(201, newProject);
};

const findAll = async (account: UserType) => {
  const projects = await Project.aggregate([
    {
      $lookup: {
        from: "members",
        localField: "members",
        foreignField: "_id",
        as: "members",
      },
    },
    {
      $match: {
        "members.email": account.email,
      },
    },
    {
      $project: {
        name: 1,
        url: 1,
        category: 1,
        totalMembers: { $size: "$members" },
      },
    },
  ]);
  return new BaseResponse<object>(200, projects);
};

const findDetail = async (id: string) => {
  const project = await Project.aggregate([
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
        localField: "_id",
        foreignField: "projectId",
        as: "tasks",
      },
    },
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
  ]);

  if (project.length === 0) throw new ApiError(404, "Project not found!");

  return new BaseResponse<object>(200, project);
};

const update = async (admin: UserType, id: string, jsonBody: ProjectSchema) => {
  const project = await Project.aggregate([
    {
      $lookup: {
        from: "members",
        localField: "members",
        foreignField: "_id",
        as: "members",
      },
    },
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
  ]);

  if (project.length === 0) throw new ApiError(404, "Project not found!");

  const isAdmin = project[0].members.find(
    (member: MemberType) =>
      member.email === admin.email && member.role === "Administrator"
  );

  if (!isAdmin)
    throw new ApiError(403, "You do not have permission to edit this project!");

  await Project.updateOne(
    { _id: new mongoose.Types.ObjectId(id) },
    {
      $set: {
        ...jsonBody,
      },
    }
  );

  return new BaseResponse<string>(200, "Updated project successfully!");
};

const remove = async (admin: UserType, id: string) => {
  const project = await Project.aggregate([
    {
      $lookup: {
        from: "members",
        localField: "members",
        foreignField: "_id",
        as: "members",
      },
    },
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
  ]);

  if (project.length === 0) throw new ApiError(404, "Project not found!");

  const isAdmin = project[0].members.find(
    (member: MemberType) =>
      member.email === admin.email && member.role === "Administrator"
  );

  if (!isAdmin)
    throw new ApiError(403, "You do not have permission to edit this project!");

  await Project.deleteOne({ _id: new mongoose.Types.ObjectId(id) });

  return new BaseResponse<string>(200, "Deleted project successfully!");
};

export { save, findAll, findDetail, update, remove };
