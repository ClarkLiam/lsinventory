import type { NextFunction, Request, Response } from "express";

const INV_CODE_PATTERN = /^INV-\d{4}$/;
const UNIT_ID_PATTERN = /^\d{2}$/;
const DEVICE_STATUS_VALUES = new Set(["available", "assigned", "maintenance"]);

const isNonEmptyString = (value: unknown): boolean =>
  typeof value === "string" && value.trim().length > 0;

/**
 * Validate payload for device create/update endpoints.
 */
export const validateDevicePayload = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { invCode, unitId, optionalField, make, model, category, status, locationId } = req.body;

  if (!INV_CODE_PATTERN.test(String(invCode || ""))) {
    res.status(400).json({ message: "invCode must match INV-XXXX" });
    return;
  }

  if (!UNIT_ID_PATTERN.test(String(unitId || ""))) {
    res.status(400).json({ message: "unitId must be two digits" });
    return;
  }

  if (optionalField && !UNIT_ID_PATTERN.test(String(optionalField))) {
    res.status(400).json({ message: "optionalField must be two digits when provided" });
    return;
  }

  if (!isNonEmptyString(make)) {
    res.status(400).json({ message: "make is required" });
    return;
  }

  if (!isNonEmptyString(model)) {
    res.status(400).json({ message: "model is required" });
    return;
  }

  if (!isNonEmptyString(category)) {
    res.status(400).json({ message: "category is required" });
    return;
  }

  if (status && !DEVICE_STATUS_VALUES.has(String(status))) {
    res.status(400).json({ message: "status must be available, assigned, or maintenance" });
    return;
  }

  if (locationId !== undefined && locationId !== null && locationId !== "") {
    const parsedLocationId = Number(locationId);

    if (!Number.isInteger(parsedLocationId) || parsedLocationId <= 0) {
      res.status(400).json({ message: "locationId must be a positive integer" });
      return;
    }
  }

  next();
};
