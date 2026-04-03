import type { NextRequest } from 'next/server'
import store from '@/lib/store'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const type = searchParams.get('type') // 'movie' | 'series' | null
  const genre = searchParams.get('genre')

  let content = store.content

  if (type === 'movie' || type === 'series') {
    content = content.filter((c) => c.type === type)
  }
  if (genre) {
    content = content.filter((c) => c.genre.toLowerCase() === genre.toLowerCase())
  }

  return Response.json({ content, total: content.length })
}
