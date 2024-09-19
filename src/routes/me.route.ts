import * as controller from "@/controllers/me.controller";
import express, { type Router } from "express";

const router: Router = express.Router();

router.get("/", controller.getProfile);

export default router;
