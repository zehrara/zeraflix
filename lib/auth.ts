import type { NextRequest } from 'next/server'
import store from './store'

// Token is simply the user ID encoded in base64 for demo purposes.
// In production, use a proper JWT library.
export function createToken(userId: string): string {
  return Buffer.from(userId).toString('base64')
}

export function parseToken(token: string): string {
  try {
    return Buffer.from(token, 'base64').toString('utf-8')
  } catch {
    return ''
  }
}

export function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization') ?? ''
  if (!authHeader.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  const userId = parseToken(token)
  return store.users.find((u) => u.id === userId) ?? null
}
