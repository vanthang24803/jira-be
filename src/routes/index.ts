import { BaseResponse } from "@/helpers";
import { logger } from "@/libs";
import express, { type Router } from "express";
import type { NextFunction, Request, Response } from "express";
import authRoute from "./auth.route";

const router: Router = express.Router();

router.use("/auth", authRoute);

router.get("/", (_: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json(new BaseResponse<string>(200, "Hello World"));
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

export { router };
