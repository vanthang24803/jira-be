import "dotenv/config";
import cors from "cors";
import express from "express";
import passport from "passport";
import "module-alias/register";
import { connection } from "@/db";
import { errorHandlerMiddleware, passportMiddleware } from "@/middlewares";
import { router } from "@/routes";
import type { Application } from "express";
import "tsconfig-paths/register";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
passport.use(passportMiddleware);

connection();

app.use("/api", router);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Application listening on port ${port}...`);
});
