import type { Request, Response } from "express";

/**
 * Handle user login.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.body;

  // TODO: Implement DB-backed credential validation and JWT issuance.
  if (!username) {
    res.status(400).json({ message: "username is required" });
    return;
  }

  res.status(200).json({ message: "Login scaffold ready", user: { username } });
};

/**
 * Handle user logout.
 */
export const logout = async (_req: Request, res: Response): Promise<void> => {
  // TODO: Add token invalidation/blacklist strategy if needed.
  res.status(200).json({ message: "Logout scaffold ready" });
};
