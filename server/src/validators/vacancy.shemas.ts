import { z } from "zod";

const vacancyBase = z.object({
  title: z.string().min(2).max(100),
  company: z.string().min(2).max(100),
  status: z
    .enum(["APPLIED", "INTERVIEW", "OFFER", "REJECTED", "WISHLIST"])
    .optional(),
  link: z.string().url().optional(),
  notes: z.string().max(2000).optional(),
});

export const createVacancySchema = z.object({
  body: vacancyBase,
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});

export const updateVacancySchema = z.object({
  body: vacancyBase.partial(),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).passthrough(),
});

export const vacancyIdParamsSchema = z.object({
  body: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  params: z.object({
    id: z.string().min(1),
  }),
});
