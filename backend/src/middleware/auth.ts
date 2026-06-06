import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "development-secret";

/**
 * Basic JWT auth middleware scaffold.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing Authorization header" });
    return;
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    jwt.verify(token, JWT_SECRET);
  } catch (_error) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }

  next();
};
