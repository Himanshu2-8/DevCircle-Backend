import { PrismaClient } from "@prisma/client";

console.log("Railway DATABASE_URL raw:", process.env.DATABASE_URL?.slice(0, 40));


const prisma = new PrismaClient();

export default prisma;
