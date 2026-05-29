import type { Request, Response } from "express";

/**
 * List inventory devices.
 */
export const listDevices = async (_req: Request, res: Response): Promise<void> => {
  // TODO: Fetch devices from MySQL.
  res.status(200).json({ data: [] });
};

/**
 * Fetch a single device by id.
 */
export const getDeviceById = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ data: { id: req.params.id } });
};

/**
 * Create a new device.
 */
export const createDevice = async (req: Request, res: Response): Promise<void> => {
  res.status(201).json({ message: "Device scaffold created", data: req.body });
};

/**
 * Update an existing device.
 */
export const updateDevice = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: "Device scaffold updated", id: req.params.id, data: req.body });
};

/**
 * Delete a device.
 */
export const deleteDevice = async (req: Request, res: Response): Promise<void> => {
  res.status(204).send();
};
