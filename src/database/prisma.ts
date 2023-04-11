import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient({
    log: (process.env.npm_lifecycle_event == "dev") ? ["error", "info", "query", "warn"] : []
})

export { prismaClient }