import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import router from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

dotenv.config({ path: "config/.env" });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "lsinventory-backend" });
});

app.use("/api", router);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
