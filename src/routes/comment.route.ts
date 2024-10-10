import * as controller from "@/controllers/comment.controller";
import express, { type Router } from "express";

const router: Router = express.Router({
  mergeParams: true,
});

router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findOne);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
