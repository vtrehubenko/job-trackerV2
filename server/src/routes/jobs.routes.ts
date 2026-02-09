import { Router } from "express";
import { createJobSchema } from "../schemas/job.schema";
import { validate } from "../middlewares/validate";
import { getAllJobs, createJob } from "../services/job.service";

const router = Router();

router.get("/", async (_req, res) => {
  const jobs = await getAllJobs();
  res.json(jobs);
});

router.post("/", validate(createJobSchema), async (req, res) => {
  const { company, position } = req.body;

  const job = await createJob(company, position);

  res.status(201).json(job);
});

export default router;
