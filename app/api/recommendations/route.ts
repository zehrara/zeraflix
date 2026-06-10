import type { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getCollection } from '@/lib/redis'
import { content, type HistoryEntry, type WatchlistEntry, type RatingEntry } from '@/lib/store'

export async function GET(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [history, watchlist, ratings] = await Promise.all([
    getCollection<HistoryEntry>('history'),
    getCollection<WatchlistEntry>('watchlist'),
    getCollection<RatingEntry>('ratings'),
  ])

  const watchedIds = new Set(history.filter((h) => h.userId === user.id).map((h) => h.contentId))
  const watchlistIds = new Set(watchlist.filter((w) => w.userId === user.id).map((w) => w.contentId))

  const genreScore: Record<string, number> = {}
  for (const contentId of watchedIds) {
    const item = content.find((c) => c.id === contentId)
    if (!item) continue
    const userRating = ratings.find((r) => r.userId === user.id && r.contentId === contentId)
    const weight = userRating ? userRating.rating / 5 : 1
    genreScore[item.genre] = (genreScore[item.genre] ?? 0) + weight
  }

  const candidates = content
    .filter((c) => !watchedIds.has(c.id) && !watchlistIds.has(c.id))
    .map((c) => ({ ...c, score: (genreScore[c.genre] ?? 0) * 2 + c.rating }))
    .sort((a, b) => b.score - a.score)

  const pool = candidates.length > 0 ? candidates : [...content].sort((a, b) => b.rating - a.rating)
  const result = pool.slice(0, 10).map(({ score: _, ...rest }: any) => rest)

  return Response.json({ recommendations: result, total: result.length })
}
