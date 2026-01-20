"use server"

import prisma from "@/lib/prisma"

export async function saveResult(score: number, total: number) {
  await prisma.quizResult.create({
    data: { score, total },
  })
}
