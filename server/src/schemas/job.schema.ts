import { z } from "zod";

export const createJobSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
});

export const updateJobSchema = z
  .object({
    company: z.string().min(1).optional(),
    position: z.string().min(1).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });
export const updateJobStatusSchema = z.object({
  status: z.enum(["APPLIED", "INTERVIEW", "OFFER", "REJECTED"]),
});
