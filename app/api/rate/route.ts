import type { NextRequest } from 'next/server'
import store from '@/lib/store'
import { getAuthUser } from '@/lib/auth'

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

  const content = store.content.find((c) => c.id === contentId)
  if (!content) {
    return Response.json({ error: 'Content not found' }, { status: 404 })
  }

  const existing = store.ratings.find((r) => r.userId === user.id && r.contentId === contentId)

  if (existing) {
    // Recalculate average: remove old rating, add new one
    const oldRating = existing.rating
    content.rating =
      (content.rating * content.ratingCount - oldRating + rating) / content.ratingCount
    existing.rating = rating
  } else {
    // Add new rating to rolling average
    content.rating =
      (content.rating * content.ratingCount + rating) / (content.ratingCount + 1)
    content.ratingCount += 1
    store.ratings.push({ userId: user.id, contentId, rating })
  }

  content.rating = Math.round(content.rating * 10) / 10

  return Response.json({ contentId, userRating: rating, newAverage: content.rating })
}
