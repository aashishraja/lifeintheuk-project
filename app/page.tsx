"use client"
import prisma from "@/lib/prisma";
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <main className="h-screen flex flex-row">
      <div className="basis-1/2 bg-amber-200 text-amber-950">
      <button
  onClick={() => router.push("/resultshistory")}
  className="underline mt-4"
>
  View Results History
</button>

      </div>
      <div className="basis-1/2 bg-amber-500 flex flex-col items-center justify-center">
        Let's Begin
        <button
          onClick={() => router.push("/quizpage")}
          className="px-6 py-3 bg-blue-800 text-white rounded-3xl mt-3"
        >
          Start Quiz
        </button>
      </div>
    </main>
  )
}