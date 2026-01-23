

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache";
export const dynamic = "force-dynamic"


export default async function ResultsHistory() {
  const results = await prisma.quizResult.findMany({
    orderBy: { createdAt: "desc" },
  })
  
  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Results History
      </h1>

      <ul className="space-y-4">
        {results.map(r => (
          <li
            key={r.id}
            className="p-4 border rounded-lg flex justify-between"
          >
            <span>
              {r.score} / {r.total}
            </span>
            <span className="text-sm text-gray-500">
              {r.createdAt.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </main>
  )
}
