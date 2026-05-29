import { Router } from "express";

import authRoutes from "./auth";
import deviceRoutes from "./devices";
import maintenanceRoutes from "./maintenance";
import packsheetRoutes from "./packsheets";
import projectRoutes from "./projects";

const router = Router();

router.use("/auth", authRoutes);
router.use("/devices", deviceRoutes);
router.use("/projects", projectRoutes);
router.use("/packsheets", packsheetRoutes);
router.use("/maintenance", maintenanceRoutes);

export default router;
