'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'
import ContentCard from '@/components/ContentCard'

interface Content {
  id: string
  title: string
  type: 'movie' | 'series'
  genre: string
  year: number
  description: string
  rating: number
}

interface WatchlistEntry {
  contentId: string
  addedAt: string
  content?: Content
}

export default function WatchlistPage() {
  const router = useRouter()
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/login'); return }
    loadWatchlist()
  }, [router])

  async function loadWatchlist() {
    setLoading(true)
    const res = await apiFetch('/api/watchlist')
    if (res.ok) {
      const data = await res.json()
      setWatchlist(data.watchlist)
    }
    setLoading(false)
  }

  async function removeFromWatchlist(contentId: string) {
    const res = await apiFetch('/api/watchlist', {
      method: 'DELETE',
      body: JSON.stringify({ contentId }),
    })
    if (res.ok) setWatchlist((prev) => prev.filter((w) => w.contentId !== contentId))
  }

  const contentIds = new Set(watchlist.map((w) => w.contentId))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">İzleme Listem</h1>
          <p className="text-zinc-500 text-sm mt-1">{watchlist.length} içerik</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-zinc-800 rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      ) : watchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {watchlist.map((w) =>
            w.content ? (
              <ContentCard
                key={w.contentId}
                content={w.content}
                inWatchlist={contentIds.has(w.contentId)}
                onRemoveFromWatchlist={removeFromWatchlist}
              />
            ) : null
          )}
        </div>
      ) : (
        <div className="text-center mt-20">
          <p className="text-zinc-500 text-lg mb-4">İzleme listeniz boş.</p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-[#E50914] hover:bg-red-700 text-white font-semibold rounded-lg transition-colors text-sm"
          >
            İçeriklere Göz At
          </Link>
        </div>
      )}
    </div>
  )
}
