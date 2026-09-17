import { PrismaClient } from "../generated/prisma";
import { load_root_environment } from "./load_root_environment";

load_root_environment();

const global_prisma = globalThis as unknown as {
  prisma_client: PrismaClient | undefined;
};

export const prisma_client =
  global_prisma.prisma_client ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global_prisma.prisma_client = prisma_client;
}
