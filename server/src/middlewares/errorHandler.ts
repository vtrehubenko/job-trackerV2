import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  //Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      errors: err.flatten(),
    });
  }

  // custom errors
  if (err.status) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  // Prisma not found
  if (err.code === "P2025") {
    return res.status(404).json({
      message: "Resource not found",
    });
  }

  console.error(err);

  return res.status(500).json({
    message: "Internal Server Error",
  });
};
