import type { NextRequest } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getCollection, setCollection } from '@/lib/redis'
import { content, type RatingEntry } from '@/lib/store'

export async function PUT(request: NextRequest) {
  const user = getAuthUser(request)
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { contentId, rating } = await request.json()

  if (!contentId || rating === undefined) {
    return Response.json({ error: 'contentId and rating are required' }, { status: 400 })
  }
  if (typeof rating !== 'number' || rating < 1 || rating > 10) {
    return Response.json({ error: 'rating must be a number between 1 and 10' }, { status: 400 })
  }
  if (!content.find((c) => c.id === contentId)) {
    return Response.json({ error: 'Content not found' }, { status: 404 })
  }

  const ratings = await getCollection<RatingEntry>('ratings')
  const existing = ratings.find((r) => r.userId === user.id && r.contentId === contentId)

  if (existing) {
    existing.rating = rating
    await setCollection('ratings', ratings)
  } else {
    await setCollection('ratings', [...ratings, { userId: user.id, contentId, rating }])
  }

  return Response.json({ contentId, userRating: rating })
}
