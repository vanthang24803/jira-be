import * as controller from "@/controllers/me.controller";
import express, { type Router } from "express";

const router: Router = express.Router();

router.get("/", controller.getProfile);
router.get("/search", controller.searchUser);
router.post("/logout", controller.logout);

export default router;
