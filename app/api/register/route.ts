import type { NextRequest } from 'next/server'
import store, { generateUserId } from '@/lib/store'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, password, name } = body ?? {}

  if (!email || !password || !name) {
    return Response.json({ error: 'email, password and name are required' }, { status: 400 })
  }

  if (store.users.find((u) => u.email === email)) {
    return Response.json({ error: 'Email already registered' }, { status: 409 })
  }

  const user = {
    id: generateUserId(),
    email,
    password,
    name,
    createdAt: new Date().toISOString(),
  }
  store.users.push(user)

  const { password: _, ...safeUser } = user
  return Response.json({ user: safeUser }, { status: 201 })
}
