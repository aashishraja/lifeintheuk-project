"use server"

import prisma from "@/lib/prisma"

export async function saveResult(score: number, total: number) {
  console.log("Saving result", score, total)
  "use server"
  await prisma.quizResult.create({
    data: { score, total },
  })
}
