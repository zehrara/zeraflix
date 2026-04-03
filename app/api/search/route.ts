import type { NextRequest } from 'next/server'
import store from '@/lib/store'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? ''

  if (!q.trim()) {
    return Response.json({ error: 'Query param "q" is required' }, { status: 400 })
  }

  const lower = q.toLowerCase()
  const results = store.content.filter(
    (c) =>
      c.title.toLowerCase().includes(lower) ||
      c.genre.toLowerCase().includes(lower) ||
      c.description.toLowerCase().includes(lower)
  )

  return Response.json({ results, total: results.length })
}
