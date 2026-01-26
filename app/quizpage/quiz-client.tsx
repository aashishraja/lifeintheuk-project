"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Question } from "../generated/prisma/client"

const QUIZ_STORAGE_KEY = "quiz-progress"
const QUESTION_COUNT = 24
const DURATION_SECONDS = 45 * 60
const PASS_MARK = 18

export default function QuizClient({
  questions,
}: {
  questions: Question[]
}) {
  const router = useRouter()

  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [finished, setFinished] = useState(false)
  const [resultSaved, setResultSaved] = useState(false)

  const [startTime, setStartTime] = useState<number | null>(null)
  const [remainingTime, setRemainingTime] = useState(DURATION_SECONDS)

  // ---------------- TEXT TO SPEECH ----------------
  function speak(text: string) {
    if (!("speechSynthesis" in window)) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "en-GB"
    utterance.rate = 1
    utterance.pitch = 1

    window.speechSynthesis.speak(utterance)
  }

  function repeatQuestion() {
    const question = selectedQuestions[currentIndex]
    if (!question) return

    const optionsText = question.options
      .map((opt, i) => `Option ${i + 1}. ${opt}.`)
      .join(" ")

    speak(`${question.question}. ${optionsText}`)
  }



  // ---------------- LOAD OR CREATE QUIZ ----------------
  useEffect(() => {
    const saved = localStorage.getItem(QUIZ_STORAGE_KEY)

    if (saved) {
      const parsed = JSON.parse(saved)

      const restoredQuestions = parsed.selectedQuestionIds
        .map((id: number) => questions.find(q => q.id === id))
        .filter(Boolean)

      if (restoredQuestions.length > 0) {
        setSelectedQuestions(restoredQuestions)
        setCurrentIndex(parsed.currentIndex)
        setAnswers(parsed.answers)
        setStartTime(parsed.startTime)
        return
      }
    }

    const shuffled = [...questions]
      .sort(() => Math.random() - 0.5)
      .slice(0, QUESTION_COUNT)

    setSelectedQuestions(shuffled)
    setStartTime(Date.now())
  }, [questions])

  // ---------------- AUTO READ QUESTION ----------------
  useEffect(() => {
    if (!selectedQuestions.length || finished) return

    const question = selectedQuestions[currentIndex]
    if (!question) return

  const optionsText = question.options
    .map((opt, i) => `Option ${i + 1}. ${opt}.`)
    .join(" ")

  speak(`${question.question}. ${optionsText}`)
  }, [currentIndex, selectedQuestions, finished])

  // ---------------- SAVE PROGRESS ----------------
  useEffect(() => {
    if (!startTime || selectedQuestions.length === 0) return

    localStorage.setItem(
      QUIZ_STORAGE_KEY,
      JSON.stringify({
        selectedQuestionIds: selectedQuestions.map(q => q.id),
        currentIndex,
        answers,
        startTime,
      })
    )
  }, [selectedQuestions, currentIndex, answers, startTime])

  // ---------------- TIMER ----------------
  useEffect(() => {
    if (!startTime || finished) return

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const remaining = DURATION_SECONDS - elapsed

      if (remaining <= 0) {
        setRemainingTime(0)
        setFinished(true)
        clearInterval(interval)
      } else {
        setRemainingTime(remaining)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime, finished])

  // ---------------- SAVE RESULT ----------------
  async function submitResult() {
    try {
      await fetch("/api/save-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: score(),
          total: selectedQuestions.length,
        }),
      })// Optionally update local state if you want to show DB-refreshed info
    
    } catch (err) {
      console.error("Failed to save quiz result", err)
    }
  }

  useEffect(() => {
    if (!finished || resultSaved) return

    window.speechSynthesis.cancel()

    // async IIFE so we can await submitResult
    ;(async () => {
      try {
        await submitResult()
        setResultSaved(true)
        localStorage.removeItem(QUIZ_STORAGE_KEY)
      } catch (err) {
        console.error("Error saving result:", err)
      }
    })()
  }, [finished, resultSaved])

  // ---------------- QUIT QUIZ ----------------
  function quitQuiz() {
    window.speechSynthesis.cancel()

    const confirmQuit = window.confirm(
      "Are you sure you want to quit? Your progress will be lost."
    )

    if (!confirmQuit) return

    localStorage.removeItem(QUIZ_STORAGE_KEY)

    setSelectedQuestions([])
    setCurrentIndex(0)
    setAnswers({})
    setFinished(false)
    setResultSaved(false)
    setStartTime(null)
    setRemainingTime(DURATION_SECONDS)

    router.push("/")
  }

  if (selectedQuestions.length === 0) {
    return <div className="p-6">Loading quiz...</div>
  }

  const currentQuestion = selectedQuestions[currentIndex]
  const selectedAnswer = answers[currentQuestion.id]

  function selectAnswer(option: string) {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: option,
    }))
  }

  function nextQuestion() {
    window.speechSynthesis.cancel()

    if (currentIndex < selectedQuestions.length - 1) {
      setCurrentIndex(i => i + 1)
    } else {
      setFinished(true)
    }
  }

  function previousQuestion() {
    window.speechSynthesis.cancel()

    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1)
    }
  }

  function score() {
    return selectedQuestions.filter(
      q => answers[q.id] === q.answer
    ).length
  }

  function passed() {
    return score() >= PASS_MARK
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${String(secs).padStart(2, "0")}`
  }

  // ---------------- FINISHED VIEW ----------------
  if (finished) {
    return (
      <div className="min-h-screen bg-primary">
      <div className="p-4 md:p-8 space-y-4 max-w-3xl mx-auto font-secondary">
        <button onClick={() => router.push("/")} className="underline">
          ← Back to menu
        </button>

        <h2 className="text-xl md:text-2xl font-bold">
          Score: {score()} / {selectedQuestions.length}
        </h2>

        <p className="text-lg">
          Time remaining: {formatTime(remainingTime)}
        </p>

        <p
          className={`text-xl font-bold ${
            passed() ? "text-green-600" : "text-red-600"
          }`}
        >
          {passed() ? "PASS" : "FAIL"}
        </p>

        {selectedQuestions.map((q, i) => {
          const userAnswer = answers[q.id]
          const correct = userAnswer === q.answer

          return (
            <div key={q.id} className="border-2 p-4 rounded border-secondary">
              <p className="font-secondary">
                {i + 1}. {q.question}
              </p>

              <p className={correct ? "text-green-600" : "text-red-600"}>
                Your answer: {userAnswer ?? "No answer"}
              </p>

              {!correct && (
                <p className="text-green-600">
                  Correct answer: {q.answer}
                </p>
              )}

              {q.answerDesc && (
                <p className="text-sm text-gray-500">
                  {q.answerDesc}
                </p>
              )}
            </div>
          )
        })}
      </div>
      </div>
    )
    
  }

  // ---------------- QUESTION VIEW ----------------
  return (
    <div className="flex flex-col md:flex-row h-full bg-primary">
      <div className="md:w-1/2 p-4 md:p-8 border-b md:border-b-0 md:border-r flex flex-col gap-4">
        <p className="text-sm font-medium text-secondary">
          Time remaining: {formatTime(remainingTime)}
        </p>

        <p className="text-sm text-secondary">
          Question {currentIndex + 1} of {selectedQuestions.length}
        </p>

        <h1 className="text-xl md:text-2xl font-main">
          {currentQuestion.question}
        </h1>
        <div className="flex items-center justify-start">
        <button
        onClick={repeatQuestion}
        className="w-40
      px-2 py-3
      bg-transparent
      text-secondary
      font-secondary
      rounded-lg
      border-2 border-secondary
      transition-all duration-200
      hover:bg-secondary
      hover:text-primary
      hover:border-secondary">
          Repeat Question
        </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:justify-between mt-auto">
  <button
    onClick={previousQuestion}
    disabled={currentIndex === 0}
    className="
      w-40
      px-8 py-3
      bg-transparent
      text-secondary
      font-secondary
      rounded-lg
      border-2 border-secondary
      transition-all duration-200
      hover:bg-secondary
      hover:text-primary
      hover:border-secondary
      disabled:opacity-50
      disabled:hover:bg-transparent
      disabled:hover:text-white
      disabled:hover:border-white
    "
  >
    Back
  </button>

  <button
    onClick={quitQuiz}
    className="
      w-40
      px-8 py-3
      bg-transparent
      text-secondary
      font-secondary
      rounded-lg
      border-2 border-secondary
      transition-all duration-200
      hover:bg-secondary
      hover:text-primary
      hover:border-secondary
    "
  >
    Menu
  </button>
</div>
      </div>

      <div className="md:w-1/2 p-4 md:p-8 flex flex-col gap-6">
        <ul className="space-y-3">
          {currentQuestion.options.map((option: string) => (
            <li key={option}>
              <label className="cursor-pointer">
                <input
                type="radio"
                name={`q-${currentQuestion.id}`}
                checked={selectedAnswer === option}
                onChange={() => selectAnswer(option)}
                className="peer sr-only"
                />

                <div
                  className="
                    flex items-center gap-3 p-3 border-2 border-secondary rounded
                    transition-all duration-150
                    peer-checked:bg-white
                    peer-checked:text-primary
                    peer-checked:border-secondary
                    hover:bg-secondary
                    hover:text-primary
                    hover:border-secondary
                    
                  "
                >
                  <span className="text-base font-secondary">{option}</span>
                </div>
              </label>
            </li>

          ))}
        </ul>

        <button
          onClick={nextQuestion}
          disabled={!selectedAnswer}
          className="mt-auto px-6 py-3 bg-transparent
      text-secondary
      font-secondary
      rounded-lg
      border-2 border-secondary
      transition-all duration-200
      hover:bg-secondary
      hover:text-primary
      hover:border-secondary disabled:opacity-50
      disabled:hover:bg-transparent
      disabled:hover:text-white
      disabled:hover:border-white"
        >
          {currentIndex === selectedQuestions.length - 1
            ? "Finish"
            : "Next"}
        </button>
      </div>
    </div>
  )
}
