import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.parse(req.body);
    req.body = parsed;
    next();
  };
