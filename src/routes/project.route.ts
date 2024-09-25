import * as controller from "@/controllers/project.controller";
import express, { type Router } from "express";

const router: Router = express.Router();

router.get("/", controller.findAll);
router.post("/", controller.create);
router.get("/:id", controller.findOne);
router.get("/:id/report", controller.reportProject);
router.post("/:id/add", controller.addMember);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
