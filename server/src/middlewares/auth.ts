import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export type AuthRequest = Request & { userId?: string };

export function requireAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    const err: any = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }

  const token = header.slice("Bearer ".length);
  const payload = verifyToken(token);
  req.userId = payload.userId;

  next();
}
