import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "node:fs";
import path from "node:path";

import router from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

dotenv.config({ path: "config/.env" });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const frontendDir = path.resolve(__dirname, "../../frontend/public");
const frontendIndex = path.join(frontendDir, "index.html");

if (fs.existsSync(frontendIndex)) {
  app.use(express.static(frontendDir));
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "lsinventory-backend" });
});

app.use("/api", router);

if (fs.existsSync(frontendIndex)) {
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(frontendIndex);
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
