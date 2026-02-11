import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Zod validation
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      code: "VALIDATION_ERROR",
      errors: err.flatten(),
    });
  }

  // Prisma not found (P2025)
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2025"
  ) {
    return res.status(404).json({
      message: "Resource not found",
      code: "NOT_FOUND",
    });
  }
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2002"
  ) {
    return res.status(409).json({
      message: "Resource already exists",
      code: "CONFLICT",
      details: err.meta,
    });
  }
  if (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    "message" in err
  ) {
    const customError = err as { status: number; message: string };
    return res.status(customError.status).json({
      message: customError.message,
      code: "CUSTOM_ERROR",
    });
  }

  console.error(err);

  return res.status(500).json({
    message: "Internal Server Error",
    code: "INTERNAL_ERROR",
  });
};
