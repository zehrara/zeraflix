import type { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getCollection } from '@/lib/redis'
import { content, type HistoryEntry } from '@/lib/store'

export async function GET(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const history = await getCollection<HistoryEntry>('history')
  const userHistory = history
    .filter((h) => h.userId === user.id)
    .sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime())
    .map((h) => ({ ...h, content: content.find((c) => c.id === h.contentId) }))

  return Response.json({ history: userHistory, total: userHistory.length })
}
