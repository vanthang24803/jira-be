import { ApiError } from "@/errors";
import type { NextFunction, Request, Response } from "express";

export const errorHandlerMiddleware = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ApiError) {
    res.status(err.code).json({
      message: err.message,
      code: err.code,
      timestamp: err.timestamp,
    });
  } else {
    res.status(500).json(new ApiError(500, err));
  }
};
