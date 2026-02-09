import { z } from "zod";

export const createJobSchema = z.object({
  company: z.string().trim().min(1, "company is required").max(120),
  position: z.string().trim().min(1, "position is required").max(120),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
