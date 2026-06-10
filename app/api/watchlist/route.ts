import type { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getCollection, setCollection } from '@/lib/redis'
import { content, type WatchlistEntry, type HistoryEntry } from '@/lib/store'

export async function GET(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const watchlist = await getCollection<WatchlistEntry>('watchlist')
  const userWatchlist = watchlist
    .filter((w) => w.userId === user.id)
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .map((w) => ({ ...w, content: content.find((c) => c.id === w.contentId) }))

  return Response.json({ watchlist: userWatchlist, total: userWatchlist.length })
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

  const [watchlist, history] = await Promise.all([
    getCollection<WatchlistEntry>('watchlist'),
    getCollection<HistoryEntry>('history'),
  ])

  if (watchlist.find((w) => w.userId === user.id && w.contentId === contentId)) {
    return Response.json({ error: 'Already in watchlist' }, { status: 409 })
  }

  const entry: WatchlistEntry = { userId: user.id, contentId, addedAt: new Date().toISOString() }
  const saves: Promise<void>[] = [setCollection('watchlist', [...watchlist, entry])]

  if (!history.find((h) => h.userId === user.id && h.contentId === contentId)) {
    saves.push(
      setCollection('history', [
        ...history,
        { userId: user.id, contentId, watchedAt: new Date().toISOString() },
      ])
    )
  }

  await Promise.all(saves)
  return Response.json({ entry }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { contentId } = await request.json()
  if (!contentId) {
    return Response.json({ error: 'contentId is required' }, { status: 400 })
  }

  const watchlist = await getCollection<WatchlistEntry>('watchlist')
  const updated = watchlist.filter((w) => !(w.userId === user.id && w.contentId === contentId))

  if (updated.length === watchlist.length) {
    return Response.json({ error: 'Not found in watchlist' }, { status: 404 })
  }

  await setCollection('watchlist', updated)
  return Response.json({ message: 'Removed from watchlist' })
}
