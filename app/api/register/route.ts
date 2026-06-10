import type { NextRequest } from 'next/server'
import { getUsers, setCollection } from '@/lib/redis'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, password, name } = body ?? {}

  if (!email || !password || !name) {
    return Response.json({ error: 'email, password and name are required' }, { status: 400 })
  }

  const users = await getUsers()
  if (users.find((u) => u.email === email)) {
    return Response.json({ error: 'Email already registered' }, { status: 409 })
  }

  const user = {
    id: crypto.randomUUID(),
    email,
    password,
    name,
    createdAt: new Date().toISOString(),
  }
  await setCollection('users', [...users, user])

  const { password: _, ...safeUser } = user
  return Response.json({ user: safeUser }, { status: 201 })
}
