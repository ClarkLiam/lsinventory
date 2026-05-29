import type { NextFunction, Request, Response } from "express";

/**
 * Basic JWT auth middleware scaffold.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  // TODO: Validate JWT signature and attach user context to request.
  if (!authHeader) {
    res.status(401).json({ message: "Missing Authorization header" });
    return;
  }

  next();
};
