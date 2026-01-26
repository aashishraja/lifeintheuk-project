"use client"
import prisma from "@/lib/prisma";
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <main className="h-screen flex md:flex-row flex-col">
      <div className="basis-1/2 flex flex-col bg-primary gap-10 md:items-start md:justify-center items-center md:p-9 px-45">
        <div className="flex md:items-end md:justify-start md:m-0 md:text-5xl font-main text-secondary text-2xl justify-left mt-8">
          <span className="block md:text-6xl md:text-left text-5xl text-center md:inline">Welcome To Life In The UK Practice</span>{" "}
        </div>
        
        <button
        onClick={() => router.push("/resultshistory")}
        className="bg-transparent w-40 p-4 border-2 border-secondary rounded-lg font-secondary text-xl text-secondary hover:bg-secondary hover:border-2 hover:border-secondary hover:text-primary"
        >
        View Results
        </button>
        
        
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