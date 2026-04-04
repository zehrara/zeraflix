import type { NextRequest } from 'next/server'
import store from './store'

// Token is simply the user ID encoded in base64 for demo purposes.
// In production, use a proper JWT library.
// Uses btoa/atob (Web Crypto compatible) instead of Buffer to work in all
// Next.js runtimes (Node.js and Edge) without Turbopack polyfill issues.
export function createToken(userId: string): string {
  return btoa(userId)
}

export function parseToken(token: string): string {
  try {
    return atob(token)
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
