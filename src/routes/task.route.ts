import * as controller from "@/controllers/task.controller";
import express, { type Router } from "express";

const router: Router = express.Router({
  mergeParams: true,
});

router.get("/", controller.findAll);
router.post("/", controller.create);
router.get("/:id", controller.findOne);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
