import { Member, type MemberType, Project, User, type UserType } from "@/db";
import { ApiError } from "@/errors";
import { BaseResponse } from "@/helpers";
import {
  type AddMemberSchema,
  type ProjectSchema,
  profileSchema,
} from "@/validations";
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
  ]);

  const newProject = projects.map((item) => ({
    ...item,
    members: item.members.length,
    tasks: item.tasks.length,
    pm: item.members.find((x: MemberType) => x.role === "Administrator"),
  }));

  return new BaseResponse<object>(200, newProject);
};

const findDetail = async (slug: string) => {
  const project = await Project.aggregate([
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

  if (project.length === 0) throw new ApiError(404, "Project not found!");

  return new BaseResponse<object>(200, project[0]);
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
      member.email === admin.email && member.role === "Administrator",
  );

  if (!isAdmin)
    throw new ApiError(403, "You do not have permission to edit this project!");

  await Project.updateOne(
    { _id: new mongoose.Types.ObjectId(id) },
    {
      $set: {
        ...jsonBody,
      },
    },
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
      member.email === admin.email && member.role === "Administrator",
  );

  if (!isAdmin)
    throw new ApiError(403, "You do not have permission to edit this project!");

  await Project.deleteOne({ _id: new mongoose.Types.ObjectId(id) });

  return new BaseResponse<string>(200, "Deleted project successfully!");
};

const addMember = async (
  admin: UserType,
  id: string,
  jsonBody: AddMemberSchema,
) => {
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
      member.email === admin.email && member.role === "Administrator",
  );

  if (!isAdmin)
    throw new ApiError(403, "You do not have permission to edit this project!");

  const account = await User.findOne({
    email: jsonBody.email,
  });

  if (!account) throw new ApiError(404, "User not found!");

  const isExistingMember = project[0].members.some(
    (member: MemberType) => member.email === account.email,
  );

  if (isExistingMember)
    throw new ApiError(400, "User is already a member of the project!");

  const newMember = await Member.create({
    email: account.email,
    avatar: account.avatar,
    fullName: `${account.firstName} ${account.lastName}`,
    role: jsonBody.role,
  });

  await Project.findByIdAndUpdate(id, {
    $push: { members: newMember._id },
  });

  return {
    message: "Member added successfully!",
    newMember,
  };
};

export { save, findAll, findDetail, update, remove, addMember };
