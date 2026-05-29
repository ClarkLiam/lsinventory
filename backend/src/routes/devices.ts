import { Router } from "express";

import {
  createDevice,
  deleteDevice,
  getDeviceById,
  listDevices,
  updateDevice,
} from "../controllers/deviceController";
import { authenticate } from "../middleware/auth";
import { validateDevicePayload } from "../utils/validators";

const router = Router();

router.use(authenticate);
router.get("/", listDevices);
router.get("/:id", getDeviceById);
router.post("/", validateDevicePayload, createDevice);
router.put("/:id", validateDevicePayload, updateDevice);
router.delete("/:id", deleteDevice);

export default router;
