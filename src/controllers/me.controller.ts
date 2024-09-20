import type { UserType } from "@/db";
import * as service from "@/functions/me.func";
import { logger } from "@/libs";
import type { NextFunction, Request, Response } from "express";

const getProfile = (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = service.getProfile(req.user as UserType);
    return res.status(200).json(response);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export { getProfile };
