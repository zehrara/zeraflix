import type { NextRequest } from 'next/server'
import { createToken } from '@/lib/auth'
import { getUsers } from '@/lib/redis'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, password } = body ?? {}

  if (!email || !password) {
    return Response.json({ error: 'email and password are required' }, { status: 400 })
  }

  const users = await getUsers()
  const user = users.find((u) => u.email === email && u.password === password)
  if (!user) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = createToken(user.id)
  const { password: _, ...safeUser } = user
  return Response.json({ token, user: safeUser })
}
