import prisma from "@/lib/prisma"
import QuizClient from "./quiz-client"

export default async function QuizPage() {
  const questions = await prisma.question.findMany()

  return (
    <main className="h-screen bg-primary">
      <QuizClient questions={questions} />
    </main>
  )
}
