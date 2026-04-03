import type { NextRequest } from 'next/server'
import store from '@/lib/store'
import { getAuthUser } from '@/lib/auth'

export async function PUT(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, password } = body ?? {}

  const index = store.users.findIndex((u) => u.id === user.id)
  if (name) store.users[index].name = name
  if (password) store.users[index].password = password

  const { password: _, ...safeUser } = store.users[index]
  return Response.json({ user: safeUser })
}

export async function DELETE(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  store.users = store.users.filter((u) => u.id !== user.id)
  store.watchlist = store.watchlist.filter((w) => w.userId !== user.id)
  store.ratings = store.ratings.filter((r) => r.userId !== user.id)
  store.history = store.history.filter((h) => h.userId !== user.id)

  return Response.json({ message: 'Account deleted' })
}
