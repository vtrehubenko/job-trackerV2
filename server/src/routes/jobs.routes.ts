import { Router } from "express";
import { validate } from "../middlewares/validate";
import { createJobSchema } from "../schemas/job.schema";
import { asyncHandler } from "../utils/asyncHandler";
import { getAllJobs, createJob } from "../services/job.service";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const jobs = await getAllJobs();
    res.json(jobs);
  }),
);

router.post(
  "/",
  validate(createJobSchema),
  asyncHandler(async (req, res) => {
    const { company, position } = req.body;
    const job = await createJob(company, position);
    res.status(201).json(job);
  }),
);

export default router;
