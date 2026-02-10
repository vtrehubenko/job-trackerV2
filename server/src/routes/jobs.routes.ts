import { Router } from "express";
import { validate } from "../middlewares/validate";
import { createJobSchema } from "../schemas/job.schema";
import { asyncHandler } from "../utils/asyncHandler";
import { getAllJobs, createJob } from "../services/job.service";
import { deleteJob } from "../services/job.service";
import { requireAuth, AuthRequest } from "../middlewares/auth";

const router = Router();

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const jobs = await getAllJobs(req.userId!);
    res.json(jobs);
  }),
);

router.post(
  "/",
  requireAuth,
  validate(createJobSchema),
  asyncHandler(async (req: AuthRequest, res) => {
    const { company, position } = req.body;
    const job = await createJob(company, position, req.userId!);
    res.status(201).json(job);
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    await deleteJob(id);
    return res.status(204).send();
  }),
);

export function getAllJobs(userId: string) {
  return prisma.job.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createJob(
  company: string,
  position: string,
  userId: string,
) {
  return prisma.job.create({
    data: { company, position, userId },
  });
}

export default router;
