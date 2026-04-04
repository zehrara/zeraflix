'use client'

import { useEffect, useRef, useState } from 'react'
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

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Content[]>([])
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { loadWatchlist() }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim()) { setResults([]); setSearched(false); return }

    debounceRef.current = setTimeout(() => { search(query) }, 400)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query])

  async function loadWatchlist() {
    const res = await apiFetch('/api/watchlist')
    if (res.ok) {
      const data = await res.json()
      setWatchlist(new Set(data.watchlist.map((w: { contentId: string }) => w.contentId)))
    }
  }

  async function search(q: string) {
    setLoading(true)
    const res = await apiFetch(`/api/search?q=${encodeURIComponent(q)}`)
    if (res.ok) {
      const data = await res.json()
      setResults(data.results)
    }
    setLoading(false)
    setSearched(true)
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
      <h1 className="text-3xl font-bold text-white mb-6">İçerik Ara</h1>

      {/* Search input */}
      <div className="relative mb-8">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Film veya dizi adı, tür, açıklama..."
          className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl pl-12 pr-4 py-4 text-base placeholder-zinc-600 focus:outline-none focus:border-[#E50914] transition-colors"
          autoFocus
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-[#E50914] border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {/* Results */}
      {searched && !loading && (
        <p className="text-zinc-500 text-sm mb-4">
          &ldquo;<span className="text-zinc-300">{query}</span>&rdquo; için{' '}
          <span className="text-white font-semibold">{results.length}</span> sonuç bulundu
        </p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map((c) => (
            <ContentCard
              key={c.id}
              content={c}
              inWatchlist={watchlist.has(c.id)}
              onAddToWatchlist={addToWatchlist}
              onRemoveFromWatchlist={removeFromWatchlist}
            />
          ))}
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <div className="text-center mt-20">
          <p className="text-zinc-500 text-lg">Sonuç bulunamadı.</p>
          <p className="text-zinc-600 text-sm mt-2">Farklı anahtar kelimeler deneyin.</p>
        </div>
      )}

      {!searched && !query && (
        <div className="text-center mt-20">
          <p className="text-zinc-600">Aramak için yazmaya başlayın.</p>
        </div>
      )}
    </div>
  )
}
