import * as controller from "@/controllers/auth.controller";
import express, { type Router } from "express";

const router: Router = express.Router();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/refresh", controller.refreshToken);
router.get("/verify", controller.verifyAccount);

export default router;
