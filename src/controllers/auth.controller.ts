import * as service from "@/functions/auth.func";
import { logger } from "@/libs";
import { registerSchema } from "@/validations";
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

export { register };
