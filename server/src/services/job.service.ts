import { prisma } from "../lib/prisma";

export const getAllJobs = async () => {
  return prisma.job.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const createJob = async (company: string, position: string) => {
  const demoEmail = "demo@jobtracker.local";

  const user =
    (await prisma.user.findUnique({
      where: { email: demoEmail },
    })) ??
    (await prisma.user.create({
      data: {
        email: demoEmail,
        password: "demo",
      },
    }));

  return prisma.job.create({
    data: {
      company,
      position,
      userId: user.id,
    },
  });
};
