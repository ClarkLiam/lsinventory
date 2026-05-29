import type { NextFunction, Request, Response } from "express";

const INV_CODE_PATTERN = /^INV-\d{4}$/;
const UNIT_ID_PATTERN = /^\d{2}$/;

/**
 * Validate payload for device create/update endpoints.
 */
export const validateDevicePayload = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { invCode, unitId, optionalField } = req.body;

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

  next();
};
