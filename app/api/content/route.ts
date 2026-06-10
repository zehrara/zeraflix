import type { NextRequest } from 'next/server'
import { content } from '@/lib/store'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const type = searchParams.get('type')
  const genre = searchParams.get('genre')

  let result = content

  if (type === 'movie' || type === 'series') {
    result = result.filter((c) => c.type === type)
  }
  if (genre) {
    result = result.filter((c) => c.genre.toLowerCase() === genre.toLowerCase())
  }

  return Response.json({ content: result, total: result.length })
}
