import * as service from "@/functions/auth.func";
import { registerSchema } from "@/validations";
import type { NextFunction, Request, Response } from "express";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jsonBody = registerSchema.parse(req.body);
    return res.json(201).json(service.register(jsonBody));
  } catch (error) {
    next(error);
  }
};

export { register };
