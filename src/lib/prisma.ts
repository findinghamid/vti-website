import { PrismaClient } from "@prisma/client";

// Ensure DATABASE_URL is defined during build / serverless cold starts
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/vti_production?schema=public";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const isDev = process.env.NODE_ENV === "development";

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    const client = new PrismaClient({
      log: isDev
        ? [
            { emit: "event", level: "error" },
            { emit: "event", level: "warn" },
          ]
        : [{ emit: "event", level: "error" }],
    });

    let offlineWarned = false;
    client.$on("error" as never, (e: any) => {
      const msg = e?.message || "";
      if (
        msg.includes("Can't reach database server") ||
        msg.includes("Connection refused") ||
        msg.includes("connect_timeout")
      ) {
        if (!offlineWarned) {
          console.warn(
            "⚠️ [Prisma] PostgreSQL database server is offline at localhost:5432. Active features are operating with resilient fallback memory stores."
          );
          offlineWarned = true;
        }
      } else {
        console.error("Prisma error:", msg);
      }
    });

    return client;
  })();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
