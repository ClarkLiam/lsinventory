import { Router } from "express";

import {
  createProject,
  getProjectById,
  listProjects,
  updateProject,
} from "../controllers/projectController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);
router.get("/", listProjects);
router.get("/:id", getProjectById);
router.post("/", createProject);
router.put("/:id", updateProject);

export default router;
