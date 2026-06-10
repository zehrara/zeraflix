import type { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getCollection, setCollection } from '@/lib/redis'
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

export async function POST(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { contentId } = await request.json()
  if (!contentId) {
    return Response.json({ error: 'contentId is required' }, { status: 400 })
  }
  if (!content.find((c) => c.id === contentId)) {
    return Response.json({ error: 'Content not found' }, { status: 404 })
  }

  const history = await getCollection<HistoryEntry>('history')
  const entry: HistoryEntry = { userId: user.id, contentId, watchedAt: new Date().toISOString() }
  const existingIdx = history.findIndex((h) => h.userId === user.id && h.contentId === contentId)

  if (existingIdx >= 0) {
    history[existingIdx] = entry
    await setCollection('history', history)
  } else {
    await setCollection('history', [...history, entry])
  }

  return Response.json({ entry }, { status: 201 })
}
