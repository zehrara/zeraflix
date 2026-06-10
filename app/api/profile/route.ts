import type { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getUsers, getCollection, setCollection } from '@/lib/redis'

export async function PUT(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, password } = body ?? {}

  const users = await getUsers()
  const index = users.findIndex((u) => u.id === user.id)
  if (index === -1) return Response.json({ error: 'User not found' }, { status: 404 })

  if (name) users[index].name = name
  if (password) users[index].password = password
  await setCollection('users', users)

  const { password: _, ...safeUser } = users[index]
  return Response.json({ user: safeUser })
}

export async function DELETE(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [users, watchlist, ratings, history] = await Promise.all([
    getUsers(),
    getCollection('watchlist'),
    getCollection('ratings'),
    getCollection('history'),
  ])

  await Promise.all([
    setCollection('users', users.filter((u: any) => u.id !== user.id)),
    setCollection('watchlist', watchlist.filter((w: any) => w.userId !== user.id)),
    setCollection('ratings', ratings.filter((r: any) => r.userId !== user.id)),
    setCollection('history', history.filter((h: any) => h.userId !== user.id)),
  ])

  return Response.json({ message: 'Account deleted' })
}
