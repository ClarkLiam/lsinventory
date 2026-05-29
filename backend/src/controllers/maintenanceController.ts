import type { Request, Response } from "express";

/**
 * List maintenance records.
 */
export const listMaintenanceRecords = async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json({ data: [] });
};

/**
 * Create a maintenance record.
 */
export const createMaintenanceRecord = async (req: Request, res: Response): Promise<void> => {
  res.status(201).json({ message: "Maintenance scaffold created", data: req.body });
};
