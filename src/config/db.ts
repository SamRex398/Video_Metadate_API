import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

declare global {
  // Extend globalThis to hold prisma across hot reloads (only in dev)
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma =
  globalThis.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

// Connection test function
export const connectToDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log("✅ Successfully connected to database");
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    throw error;
  }
};

export { prisma };
