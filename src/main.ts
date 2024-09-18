import { healthCheckDB } from "@/db";
import { errorHandlerMiddleware } from "@/middlewares";
import { router } from "@/routes";
import cors from "cors";
import express from "express";
import type { Application } from "express";
import morgan from "morgan";

const app: Application = express();

app.use(cors());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms"),
);

healthCheckDB();

app.use(router);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Application listening on port ${port}...`);
});
