import type { NextRequest } from 'next/server'
import store from '@/lib/store'
import { getAuthUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { contentId } = await request.json()
  if (!contentId) {
    return Response.json({ error: 'contentId is required' }, { status: 400 })
  }

  if (!store.content.find((c) => c.id === contentId)) {
    return Response.json({ error: 'Content not found' }, { status: 404 })
  }

  if (store.watchlist.find((w) => w.userId === user.id && w.contentId === contentId)) {
    return Response.json({ error: 'Already in watchlist' }, { status: 409 })
  }

  const entry = { userId: user.id, contentId, addedAt: new Date().toISOString() }
  store.watchlist.push(entry)

  // Record to history as well
  const alreadyInHistory = store.history.find(
    (h) => h.userId === user.id && h.contentId === contentId
  )
  if (!alreadyInHistory) {
    store.history.push({ userId: user.id, contentId, watchedAt: new Date().toISOString() })
  }

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

  const before = store.watchlist.length
  store.watchlist = store.watchlist.filter(
    (w) => !(w.userId === user.id && w.contentId === contentId)
  )

  if (store.watchlist.length === before) {
    return Response.json({ error: 'Not found in watchlist' }, { status: 404 })
  }

  return Response.json({ message: 'Removed from watchlist' })
}
