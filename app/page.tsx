'use client'

import { useEffect, useState } from 'react'
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

const FILTERS = [
  { label: 'Tümü', value: '' },
  { label: 'Filmler', value: 'movie' },
  { label: 'Diziler', value: 'series' },
]

export default function HomePage() {
  const [content, setContent] = useState<Content[]>([])
  const [filter, setFilter] = useState('')
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadContent() }, [filter])
  useEffect(() => { loadWatchlist() }, [])

  async function loadContent() {
    setLoading(true)
    const url = filter ? `/api/content?type=${filter}` : '/api/content'
    const res = await apiFetch(url)
    if (res.ok) {
      const data = await res.json()
      setContent(data.content)
    }
    setLoading(false)
  }

  async function loadWatchlist() {
    const res = await apiFetch('/api/watchlist')
    if (res.ok) {
      const data = await res.json()
      setWatchlist(new Set(data.watchlist.map((w: { contentId: string }) => w.contentId)))
    }
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
      <div className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-2">
          <span className="text-[#E50914]">Zeraflix</span>&apos;e Hoş Geldin
        </h1>
        <p className="text-zinc-400 text-lg">Film ve dizileri keşfet, izleme listeni oluştur.</p>
      </div>

      <div className="flex gap-3 mb-8">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              filter === f.value
                ? 'bg-[#E50914] text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-zinc-800 rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      ) : content.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {content.map((c) => (
            <ContentCard
              key={c.id}
              content={c}
              inWatchlist={watchlist.has(c.id)}
              onAddToWatchlist={addToWatchlist}
              onRemoveFromWatchlist={removeFromWatchlist}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-zinc-500 mt-20">İçerik bulunamadı.</p>
      )}
    </div>
  )
}
