import { Router } from "express";
import { validate } from "../middlewares/validate";
import { createJobSchema } from "../schemas/job.schema";
import { asyncHandler } from "../utils/asyncHandler";
import { getAllJobs, createJob } from "../services/job.service";
import { deleteJob } from "../services/job.service";
import { authMiddleware } from "../middlewares/auth.middleware";
import { updateJobSchema } from "../schemas/job.schema";
import { updateJob } from "../services/job.service";
import { getJobById } from "../services/job.service";
import { updateJobStatusSchema } from "../schemas/job.schema";
import { updateJobStatus } from "../services/job.service";

const router = Router();

/**
 * @openapi
 * /jobs:
 *   get:
 *     summary: Get jobs list (with pagination/search/sort)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 10 }
 *       - in: query
 *         name: query
 *         schema: { type: string, example: "react" }
 *       - in: query
 *         name: sort
 *         schema: { type: string, example: "createdAt:desc" }
 *     responses:
 *       200:
 *         description: Jobs list
 */

/**
 * @openapi
 * /jobs/{id}/status:
 *   patch:
 *     summary: Update job status
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [APPLIED, INTERVIEW, OFFER, REJECTED]
 *     responses:
 *       200:
 *         description: Updated job
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */

router.get(
  "/",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const jobs = await getAllJobs(req.userId!);
    res.json(jobs);
  }),
);

router.post(
  "/",
  authMiddleware,
  validate(createJobSchema),
  asyncHandler(async (req, res) => {
    const { company, position } = req.body;

    const job = await createJob(company, position, req.userId!);

    res.status(201).json(job);
  }),
);

router.delete(
  "/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    await deleteJob(req.params.id, req.userId!);
    res.status(204).send();
  }),
);

router.patch(
  "/:id",
  authMiddleware,
  validate(updateJobSchema),
  asyncHandler(async (req, res) => {
    const updated = await updateJob(req.params.id, req.userId!, req.body);
    res.json(updated);
  }),
);

router.get(
  "/",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const query =
      typeof req.query.query === "string" ? req.query.query : undefined;
    const sort =
      typeof req.query.sort === "string" ? req.query.sort : undefined;

    const data = await getAllJobs(req.userId!, { page, limit, query, sort });
    res.json(data);
  }),
);

router.get(
  "/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const job = await getJobById(req.params.id, req.userId!);
    res.json(job);
  }),
);

router.patch(
  "/:id/status",
  authMiddleware,
  validate(updateJobStatusSchema),
  asyncHandler(async (req, res) => {
    const job = await updateJobStatus(
      req.params.id,
      req.userId!,
      req.body.status,
    );
    res.json(job);
  }),
);
export default router;
