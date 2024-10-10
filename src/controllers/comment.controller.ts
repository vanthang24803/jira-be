import type { UserType } from "@/db";
import * as service from "@/functions/comment.func";
import { logger } from "@/libs";
import { commentValidation } from "@/validations/comment.validation";
import type { NextFunction, Request, Response } from "express";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as UserType;

    const { taskId } = req.params;

    const jsonBody = commentValidation.parse(req.body);

    const result = await service.createComment(user, taskId, jsonBody);

    return res.status(201).json(result);
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId } = req.params;
    const result = await service.findAllComments(taskId);

    return res.status(200).json(result);
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

const findOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId, id } = req.params;
    const result = await service.findOneComment(taskId, id);

    return res.status(200).json(result);
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as UserType;

    const { taskId, id } = req.params;
    const jsonBody = commentValidation.parse(req.body);

    const result = await service.updateComment(user, taskId, id, jsonBody);

    return res.status(200).json(result);
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as UserType;

    const { taskId, id } = req.params;

    const result = await service.removeComment(user, taskId, id);

    return res.status(200).json(result);
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

export { create, findAll, findOne, update, remove };
