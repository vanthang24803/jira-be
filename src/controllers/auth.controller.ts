import * as service from "@/functions/auth.func";
import { logger } from "@/libs";
import { loginSchema, registerSchema, tokenSchema } from "@/validations";
import type { NextFunction, Request, Response } from "express";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jsonBody = registerSchema.parse(req.body);
    return res.status(201).json(await service.register(jsonBody));
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jsonBody = loginSchema.parse(req.body);
    return res.status(200).json(await service.login(jsonBody));
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const jsonBody = tokenSchema.parse(req.body);

    const result = await service.refreshToken(jsonBody);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export { register, login, refreshToken };
