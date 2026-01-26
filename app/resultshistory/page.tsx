import prisma from "@/lib/prisma"

export default async function ResultsHistory() {
  const results = await prisma.quizResult.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-primary">
      <main className="p-8 max-w-xl mx-auto font-secondary">
        <h1 className="text-2xl font-bold mb-6 text-white">
          Results History
        </h1>

        <ul className="space-y-4">
          {results.map(r => {
            const passed = r.score >= 18

            return (
              <li
                key={r.id}
                className={`
                  p-4 rounded-lg flex justify-between border-2
                  ${passed
                    ? "border-green-500 bg-green-500/10"
                    : "border-red-500 bg-red-500/10"}
                `}
              >
                <span className="text-white">
                  {r.score} / {r.total}
                </span>

                <span className="text-sm text-secondary">
                  {r.createdAt.toLocaleString()}
                </span>
              </li>
            )
          })}
        </ul>
      </main>
    </div>
  )
}
