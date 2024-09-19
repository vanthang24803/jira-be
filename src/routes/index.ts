import { BaseResponse } from "@/helpers";
import { logger } from "@/libs";
import express, { type Router } from "express";
import type { NextFunction, Request, Response } from "express";
import passport from "passport";
import authRoute from "./auth.route";
import meRoute from "./me.route";

const router: Router = express.Router();

router.use("/auth", authRoute);
router.use("/me", passport.authenticate("jwt", { session: false }), meRoute);

router.get("/", (_: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json(new BaseResponse<string>(200, "Hello World"));
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

export { router };
