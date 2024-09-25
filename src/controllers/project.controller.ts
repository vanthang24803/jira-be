import type { UserType } from "@/db";
import { ApiError } from "@/errors";
import * as service from "@/functions/project.func";
import { logger } from "@/libs";
import { addMemberSchema, projectSchema } from "@/validations";
import type { NextFunction, Request, Response } from "express";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jsonBody = projectSchema.parse(req.body);

    const author = req.user as UserType;

    const result = await service.save(author, jsonBody);

    return res.status(201).json(result);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const author = req.user as UserType;

    const result = await service.findAll(author);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const findOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await service.findDetail(id);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const admin = req.user as UserType;

    const jsonBody = projectSchema.parse(req.body);

    const result = await service.update(admin, id, jsonBody);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const admin = req.user as UserType;

    const result = await service.remove(admin, id);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const addMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const admin = req.user as UserType;

    const jsonBody = addMemberSchema.parse(req.body);

    const result = await service.addMember(admin, id, jsonBody);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const reportProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const member = req.user as UserType;

    if (!member) throw new ApiError(401, "Unauthorize");

    const result = await service.reportProject(id);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export { create, findAll, findOne, update, remove, addMember, reportProject };
