import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

// 开发环境复用 Prisma 实例，避免热更新时重复创建连接。
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
