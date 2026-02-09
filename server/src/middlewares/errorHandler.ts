import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      errors: err.flatten(),
    });
  }

  // Default
  console.error(err);
  return res.status(500).json({ message: "Internal Server Error" });
};
