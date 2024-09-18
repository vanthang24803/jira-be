import { BaseResponse } from "@/helpers";
import express, { type Router } from "express";
import type { NextFunction, Request, Response } from "express";

const router: Router = express.Router();

router.get("/", (_: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json(new BaseResponse<string>(200, "Hello World"));
  } catch (error) {
    next(error);
  }
});

export { router };
