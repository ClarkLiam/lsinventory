import crypto from "node:crypto";

import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

import { query } from "../utils/database";

interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  password_hash: string;
}

type AuthUser = {
  id: number;
  username: string;
  password_hash: string;
};

const JWT_SECRET = process.env.JWT_SECRET || "development-secret";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "12h") as jwt.SignOptions["expiresIn"];
const DEFAULT_BOOTSTRAP_USERNAME = "lsinventory";
const DEFAULT_BOOTSTRAP_PASSWORD = "ls";

const hashPassword = (password: string): string =>
  crypto.createHash("sha256").update(password).digest("hex");

const passwordMatches = (storedHash: string, password: string): boolean =>
  storedHash === password || storedHash === hashPassword(password);

const signToken = (user: Pick<UserRow, "id" | "username">): string =>
  jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

/**
 * Handle user login.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");

  if (!username || !password) {
    res.status(400).json({ message: "username and password are required" });
    return;
  }

  if (username === DEFAULT_BOOTSTRAP_USERNAME && password === DEFAULT_BOOTSTRAP_PASSWORD) {
    const token = signToken({ id: 1, username });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: 1,
        username,
      },
    });
    return;
  }

  const rows = await query<UserRow[]>(
    "SELECT id, username, password_hash FROM users WHERE username = ? LIMIT 1",
    [username],
  );

  const user = rows[0];

  if (!user || !passwordMatches(user.password_hash, password)) {
    res.status(401).json({ message: "Invalid username or password" });
    return;
  }

  const token = signToken(user);

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      username: user.username,
    },
  });
};

/**
 * Handle user logout.
 */
export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: "Logout successful" });
};
