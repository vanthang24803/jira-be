import { ApiError } from "@/errors";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const errorHandlerMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof z.ZodError) {
    res.status(400).json(new ApiError(400, err.flatten()));
    return;
  }
  if (err instanceof ApiError) {
    res.status(err.code).json(err);
  }
  res.status(500).json(new ApiError(500, "Internal Sever Error"));
};
