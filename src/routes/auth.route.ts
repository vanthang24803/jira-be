import * as controller from "@/controllers/auth.controller";
import express, { type Router } from "express";

const router: Router = express.Router();

router.post("/register", controller.register);

export default router;
