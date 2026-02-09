import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler";

import jobsRoutes from "./routes/jobs.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/jobs", jobsRoutes);

const PORT = Number(process.env.PORT) || 4000;

app.use(errorHandler);

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
