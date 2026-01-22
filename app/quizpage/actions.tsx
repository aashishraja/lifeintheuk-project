"use server"

import prisma from "@/lib/prisma"

export async function saveResult(score: number, total: number) {
  console.log("Saving result", score, total)
  
  await prisma.quizResult.create({
    data: { score, total },
  })
}
