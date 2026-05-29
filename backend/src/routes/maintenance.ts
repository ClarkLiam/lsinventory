import { Router } from "express";

import {
  createMaintenanceRecord,
  listMaintenanceRecords,
} from "../controllers/maintenanceController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);
router.get("/", listMaintenanceRecords);
router.post("/", createMaintenanceRecord);

export default router;
