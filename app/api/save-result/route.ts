// app/api/save-result/route.ts
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  console.log("API route /api/save-result called")
    try {
    const body = await req.json()
    const { score, total } = body

    const result = await prisma.quizResult.create({
      data: {
        score,
        total,
      },
    })

    return NextResponse.json(result)
  } catch (err) {
    console.error("Failed to save result:", err)
    return NextResponse.error()
  }
}
