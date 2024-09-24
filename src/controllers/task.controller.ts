import type { UserType } from "@/db";
import * as service from "@/functions/task.func";
import { logger } from "@/libs";
import { taskSchema } from "@/validations";
import type { NextFunction, Request, Response } from "express";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.projectId;

    const author = req.user as UserType;

    const jsonBody = taskSchema.parse(req.body);

    const result = await service.save(author, projectId, jsonBody);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.projectId;

    const member = req.user as UserType;

    const result = await service.findAll(member, projectId);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const findOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.projectId;
    const taskId = req.params.id;

    const member = req.user as UserType;

    const result = await service.findDetail(member, projectId, taskId);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.projectId;
    const taskId = req.params.id;
    const member = req.user as UserType;
    const jsonBody = taskSchema.parse(req.body);

    const result = await service.update(member, projectId, taskId, jsonBody);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.projectId;
    const taskId = req.params.id;
    const member = req.user as UserType;

    const result = await service.remove(member, projectId, taskId);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export { findAll, findOne, create, update, remove };
