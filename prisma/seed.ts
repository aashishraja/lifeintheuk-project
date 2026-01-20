import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { readFileSync } from "fs";
import path from "path";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// Load ../questions.json
const questionsPath = path.resolve(__dirname, "../questions.json");

const questionData = JSON.parse(
  readFileSync(questionsPath, "utf-8")
) as Prisma.QuestionCreateInput[];

export async function main() {
  for (const q of questionData) {
    await prisma.question.create({
      data: q,
    });
  }
}

main();
