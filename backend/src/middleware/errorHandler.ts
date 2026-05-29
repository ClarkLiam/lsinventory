import type { NextFunction, Request, Response } from "express";

/**
 * Catch-all 404 handler.
 */
export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({ message: "Route not found" });
};

/**
 * Global error middleware.
 */
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};
