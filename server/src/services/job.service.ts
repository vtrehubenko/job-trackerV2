import { prisma } from "../lib/prisma";

export const getAllJobs = async (
  userId: string,
  params: GetJobsParams = {},
) => {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(50, Math.max(1, params.limit ?? 10));
  const skip = (page - 1) * limit;

  const query = params.query?.trim();
  const where: any = { userId };

  if (query) {
    where.OR = [
      { company: { contains: query, mode: "insensitive" } },
      { position: { contains: query, mode: "insensitive" } },
    ];
  }
  let orderBy: any = { createdAt: "desc" };
  if (params.sort) {
    const [field, directionRaw] = params.sort.split(":");
    const direction = directionRaw === "asc" ? "asc" : "desc";

    const allowedFields = new Set(["createdAt", "company", "position"]);
    if (allowedFields.has(field)) {
      orderBy = { [field]: direction };
    }
  }

  const [items, total] = await prisma.$transaction([
    prisma.job.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.job.count({ where }),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
};

export function createJob(company: string, position: string, userId: string) {
  return prisma.job.create({
    data: {
      company,
      position,
      userId,
    },
  });
}

export const deleteJob = async (id: string, userId: string) => {
  const result = await prisma.job.deleteMany({
    where: { id, userId },
  });

  if (result.count === 0) {
    const err = new Error("Job not found or forbidden");
    (err as any).status = 404;
    throw err;
  }
};

export const updateJob = async (
  id: string,
  userId: string,
  data: { company?: string; position?: string },
) => {
  const job = await prisma.job.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });

  if (!job) {
    const err = new Error("Job not found");
    (err as any).status = 404;
    throw err;
  }

  if (job.userId !== userId) {
    const err = new Error("Forbidden");
    (err as any).status = 403;
    throw err;
  }

  return prisma.job.update({
    where: { id },
    data,
  });
};

type GetJobsParams = {
  page?: number;
  limit?: number;
  query?: string;
  sort?: string;
};

export const getJobById = async (id: string, userId: string) => {
  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job) {
    const err = new Error("Job not found");
    (err as any).status = 404;
    throw err;
  }

  if (job.userId !== userId) {
    const err = new Error("Forbidden");
    (err as any).status = 403;
    throw err;
  }

  return job;
};

export const updateJobStatus = async (
  id: string,
  userId: string,
  status: "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED",
) => {
  const job = await prisma.job.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });

  if (!job) {
    const err = new Error("Job not found");
    (err as any).status = 404;
    throw err;
  }

  if (job.userId !== userId) {
    const err = new Error("Forbidden");
    (err as any).status = 403;
    throw err;
  }

  return prisma.job.update({
    where: { id },
    data: { status },
  });
};
