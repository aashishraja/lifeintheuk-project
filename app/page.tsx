"use client"
import prisma from "@/lib/prisma";
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <main className="h-screen flex md:flex-row flex-col">
      <div className="basis-1/2 flex flex-col bg-primary">
        <div className="basis-2/3 p-8 flex md:items-end md:justify-start md:text-5xl font-main text-secondary text-2xl justify-left">
        Welcome To <br /> Life In The UK <br /> Practice
        </div>
        <div className="basis-1/3 p-8">
        <button
        onClick={() => router.push("/resultshistory")}
        className="bg-transparent w-40 p-4 border-2 border-secondary rounded-lg font-secondary text-xl text-secondary hover:bg-secondary hover:border-2 hover:border-secondary hover:text-primary"
        >
        View Results
        </button>
        </div>
      </div>
      <div className="basis-1/2 bg-tertiary flex flex-col items-center text-5xl justify-center font-main gap-4">
        Let's Begin
        <button
        onClick={() => router.push("/quizpage")}
        className="bg-transparent p-4 w-40 mt-7 border-2 border-secondary rounded-lg font-secondary text-xl text-secondary hover:bg-secondary hover:border-2 hover:border-secondary hover:text-primary"
        >
        Start Quiz
        </button>
      </div>
    </main>
  )
}