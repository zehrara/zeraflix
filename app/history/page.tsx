'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'

interface Content {
  id: string
  title: string
  type: 'movie' | 'series'
  genre: string
  year: number
  rating: number
}

interface HistoryEntry {
  contentId: string
  watchedAt: string
  content?: Content
}

export default function HistoryPage() {
  const router = useRouter()
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('token')) { router.push('/login'); return }
    apiFetch('/api/history')
      .then((r) => r.json())
      .then((d) => setHistory(d.history ?? []))
      .finally(() => setLoading(false))
  }, [router])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">İzleme Geçmişi</h1>
        <p className="text-zinc-500 text-sm mt-1">{history.length} içerik izlendi</p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-zinc-800 rounded-xl h-20 animate-pulse" />
          ))}
        </div>
      ) : history.length > 0 ? (
        <div className="flex flex-col gap-3">
          {history.map((h, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 text-lg">
                {h.content?.type === 'movie' ? '🎬' : '📺'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">
                  {h.content?.title ?? h.contentId}
                </p>
                <p className="text-zinc-500 text-xs mt-0.5">
                  {h.content?.genre} · {h.content?.year} ·{' '}
                  <span className="text-yellow-400">★ {h.content?.rating}</span>
                </p>
              </div>
              <div className="text-right shrink-0">
                <span
                  className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                    h.content?.type === 'movie'
                      ? 'bg-blue-900/50 text-blue-300'
                      : 'bg-purple-900/50 text-purple-300'
                  }`}
                >
                  {h.content?.type === 'movie' ? 'Film' : 'Dizi'}
                </span>
                <p className="text-zinc-600 text-xs mt-1">
                  {new Date(h.watchedAt).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-20">
          <p className="text-zinc-500 text-lg">Henüz izleme geçmişin yok.</p>
          <p className="text-zinc-600 text-sm mt-2">
            Bir içeriği izleme listesine ekleyince geçmişe de eklenir.
          </p>
        </div>
      )}
    </div>
  )
}
