// singleton.ts
import { PrismaClient } from "@prisma/client";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";

let prisma: PrismaClient | DeepMockProxy<PrismaClient>;

if (process.env.NODE_ENV === "test") {
  // Use a deep mock for Prisma during testing
  prisma = mockDeep<PrismaClient>();
} else {
  prisma = new PrismaClient();
}

export const prismaMock = prisma as DeepMockProxy<PrismaClient>;
export default prisma;
