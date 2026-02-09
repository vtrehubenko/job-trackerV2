import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is missing in server/.env");

export const prisma = new PrismaClient({
  // Prisma 7 override
  datasources: {
    db: { url },
  },
} as any);
