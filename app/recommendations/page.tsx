'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function RecommendationsPage() {
  const router = useRouter()
  const [recs, setRecs] = useState<Content[]>([])
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/login'); return }
    loadAll()
  }, [router])

  async function loadAll() {
    setLoading(true)
    const [recRes, wlRes] = await Promise.all([
      apiFetch('/api/recommendations'),
      apiFetch('/api/watchlist'),
    ])
    if (recRes.ok) {
      const d = await recRes.json()
      setRecs(d.recommendations)
    }
    if (wlRes.ok) {
      const d = await wlRes.json()
      setWatchlist(new Set(d.watchlist.map((w: { contentId: string }) => w.contentId)))
    }
    setLoading(false)
  }

  async function addToWatchlist(contentId: string) {
    const res = await apiFetch('/api/watchlist', {
      method: 'POST',
      body: JSON.stringify({ contentId }),
    })
    if (res.ok) setWatchlist((prev) => new Set([...prev, contentId]))
  }

  async function removeFromWatchlist(contentId: string) {
    const res = await apiFetch('/api/watchlist', {
      method: 'DELETE',
      body: JSON.stringify({ contentId }),
    })
    if (res.ok) setWatchlist((prev) => { const s = new Set(prev); s.delete(contentId); return s })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Senin İçin Öneriler</h1>
        <p className="text-zinc-500 text-sm mt-1">
          İzleme geçmişine ve beğenilerine göre seçildi
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-zinc-800 rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      ) : recs.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {recs.map((c) => (
              <ContentCard
                key={c.id}
                content={c}
                inWatchlist={watchlist.has(c.id)}
                onAddToWatchlist={addToWatchlist}
                onRemoveFromWatchlist={removeFromWatchlist}
              />
            ))}
          </div>
          <p className="text-center text-zinc-700 text-xs mt-8">
            Daha fazla içerik izledikçe öneriler kişiselleşir.
          </p>
        </>
      ) : (
        <div className="text-center mt-20">
          <p className="text-zinc-500 text-lg">Henüz yeterli veri yok.</p>
          <p className="text-zinc-600 text-sm mt-2">
            Birkaç içerik izleme listene ekle, öneri algoritması çalışmaya başlasın.
          </p>
        </div>
      )}
    </div>
  )
}
