import express from "express";
import cors from "cors";
import morgan from "morgan";
import type { Application, Request, Response } from "express";

const app: Application = express();

app.use(cors());

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Hello World",
  });
});

app.listen(port, () => {
  console.log(`Application listening on port ${port}...`);
});
