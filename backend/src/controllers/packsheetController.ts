import type { Request, Response } from "express";

/**
 * Create a new packsheet for a project.
 */
export const createPacksheet = async (req: Request, res: Response): Promise<void> => {
  // TODO: Build packsheet items from project_devices assignments.
  res.status(201).json({ message: "Packsheet scaffold created", data: req.body });
};

/**
 * Retrieve a packsheet by id.
 */
export const getPacksheetById = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ data: { id: req.params.id, items: [] } });
};

/**
 * Export packsheet to PDF.
 */
export const getPacksheetPdf = async (req: Request, res: Response): Promise<void> => {
  // TODO: Stream generated pdfkit document.
  res.status(200).json({ message: "PDF export scaffold", packsheetId: req.params.id });
};

/**
 * Mark a packsheet item as picked by QR check-off.
 */
export const markPacksheetItemPicked = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: "Check-off scaffold", packsheetId: req.params.id, data: req.body });
};
