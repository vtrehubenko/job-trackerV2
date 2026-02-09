import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./lib/prisma";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "job-tracker-api" });
});

app.get("/jobs", async (_req, res) => {
  const jobs = await prisma.job.findMany({ orderBy: { createdAt: "desc" } });
  res.json(jobs);
});

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));

app.get("/jobs", async (_req, res) => {
  const jobs = await prisma.job.findMany({ orderBy: { createdAt: "desc" } });
  res.json(jobs);
});

app.post("/jobs", async (req, res) => {
  const { company, position } = req.body;

  if (!company || !position) {
    return res
      .status(400)
      .json({ message: "company and position are required" });
  }

  const demoEmail = "demo@jobtracker.local";
  const user =
    (await prisma.user.findUnique({ where: { email: demoEmail } })) ??
    (await prisma.user.create({
      data: { email: demoEmail, password: "demo" },
    }));

  const job = await prisma.job.create({
    data: { company, position, userId: user.id },
  });

  res.status(201).json(job);
});
