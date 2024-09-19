import type { NextFunction, Request, Response } from "express";

const getProfile = (req: Request, res: Response, next: NextFunction) => {
  return res.send(req.user);
};

export { getProfile };
