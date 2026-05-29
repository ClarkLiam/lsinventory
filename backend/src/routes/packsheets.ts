import { Router } from "express";

import {
  createPacksheet,
  getPacksheetById,
  getPacksheetPdf,
  markPacksheetItemPicked,
} from "../controllers/packsheetController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);
router.post("/", createPacksheet);
router.get("/:id", getPacksheetById);
router.get("/:id/pdf", getPacksheetPdf);
router.post("/:id/checkoff", markPacksheetItemPicked);

export default router;
