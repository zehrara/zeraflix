import type { NextRequest } from 'next/server'
import store from '@/lib/store'
import { getAuthUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userHistory = store.history
    .filter((h) => h.userId === user.id)
    .sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime())

  const enriched = userHistory.map((h) => ({
    ...h,
    content: store.content.find((c) => c.id === h.contentId),
  }))

  return Response.json({ history: enriched, total: enriched.length })
}
