import { User, type UserType } from "@/db";
import * as service from "@/functions/me.func";
import { logger } from "@/libs";
import { profileSchema } from "@/validations";
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

const searchUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.query.email?.toString();

    if (!email) {
      return res.status(200).json([]);
    }
    const users = await User.find({
      email: { $regex: new RegExp(email, "i") },
    });

    const dataResponse = users.map((data) => profileSchema.parse(data));

    return res.status(200).json(dataResponse);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = service.logout(req.user as UserType);
    return res.status(200).json(response);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export { getProfile, searchUser, logout };
