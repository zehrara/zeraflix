import type { NextRequest } from 'next/server'
import store from '@/lib/store'
import { getAuthUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Gather genres from user's watch history
  const watchedIds = new Set(
    store.history.filter((h) => h.userId === user.id).map((h) => h.contentId)
  )

  const watchlistIds = new Set(
    store.watchlist.filter((w) => w.userId === user.id).map((w) => w.contentId)
  )

  // Count genre preferences from history + ratings
  const genreScore: Record<string, number> = {}

  for (const contentId of watchedIds) {
    const content = store.content.find((c) => c.id === contentId)
    if (!content) continue
    const userRating = store.ratings.find(
      (r) => r.userId === user.id && r.contentId === contentId
    )
    const weight = userRating ? userRating.rating / 5 : 1
    genreScore[content.genre] = (genreScore[content.genre] ?? 0) + weight
  }

  // Score every content item not already watched or in watchlist
  const candidates = store.content
    .filter((c) => !watchedIds.has(c.id) && !watchlistIds.has(c.id))
    .map((c) => ({
      ...c,
      score: (genreScore[c.genre] ?? 0) * 2 + c.rating,
    }))
    .sort((a, b) => b.score - a.score)

  // Fall back to top-rated content if user has no history
  const recommendations =
    candidates.length > 0
      ? candidates
      : [...store.content].sort((a, b) => b.rating - a.rating)

  const result = recommendations.slice(0, 10).map((c) => {
    const { score: _, ...rest } = c as typeof c & { score: number }
    return rest
  })

  return Response.json({ recommendations: result, total: result.length })
}
