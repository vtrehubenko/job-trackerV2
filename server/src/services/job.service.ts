import { prisma } from "../lib/prisma";

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

export const deleteJob = async (id: string) => {
  const job = await prisma.job.findUnique({
    where: { id },
  });

  if (!job) {
    const error = new Error("Job not found");
    (error as any).status = 404;
    throw error;
  }

  return prisma.job.delete({
    where: { id },
  });
};
