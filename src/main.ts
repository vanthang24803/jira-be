import "module-alias/register";
import "dotenv/config";
import { connection } from "@/db";
import { errorHandlerMiddleware } from "@/middlewares";
import { router } from "@/routes";
import cors from "cors";
import express from "express";
import type { Application } from "express";

const app: Application = express();

app.use(cors());
app.use(express.json());

connection();

app.use(router);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Application listening on port ${port}...`);
});
