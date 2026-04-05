'use client'

interface Content {
  id: string
  title: string
  type: 'movie' | 'series'
  genre: string
  year: number
  description: string
  rating: number
  videoUrl?: string
}

interface Props {
  content: Content
  onAddToWatchlist?: (id: string) => void
  onRemoveFromWatchlist?: (id: string) => void
  inWatchlist?: boolean
}

const genreColors: Record<string, string> = {
  crime: 'from-slate-700 to-slate-900',
  'sci-fi': 'from-indigo-900 to-slate-900',
  action: 'from-orange-900 to-slate-900',
  drama: 'from-purple-900 to-slate-900',
  default: 'from-zinc-700 to-zinc-900',
}

export default function ContentCard({ content, onAddToWatchlist, onRemoveFromWatchlist, inWatchlist }: Props) {
  const gradient = genreColors[content.genre] ?? genreColors.default

  function handleCardClick() {
    if (content.videoUrl) window.open(content.videoUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      className="group relative bg-zinc-900 rounded-lg overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-black/60 transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Placeholder image area */}
      <div className={`h-40 bg-gradient-to-br ${gradient} flex items-end justify-between p-3`}>
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          {content.genre}
        </span>
        {content.videoUrl && (
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-4 h-4 text-white fill-white ml-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content info */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-white text-sm leading-tight line-clamp-2">{content.title}</h3>
          <span
            className={`shrink-0 text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
              content.type === 'movie'
                ? 'bg-blue-900/60 text-blue-300'
                : 'bg-purple-900/60 text-purple-300'
            }`}
          >
            {content.type === 'movie' ? 'Film' : 'Dizi'}
          </span>
        </div>

        <p className="text-xs text-zinc-500 line-clamp-2">{content.description}</p>

        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-zinc-500">{content.year}</span>
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-semibold text-zinc-300">{content.rating}</span>
          </div>
        </div>

        {/* Watchlist button */}
        {(onAddToWatchlist || onRemoveFromWatchlist) && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (inWatchlist) onRemoveFromWatchlist?.(content.id)
              else onAddToWatchlist?.(content.id)
            }}
            className={`mt-1 w-full py-1.5 text-xs font-semibold rounded transition-colors ${
              inWatchlist
                ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                : 'bg-[#E50914] text-white hover:bg-red-700'
            }`}
          >
            {inWatchlist ? '✓ Listede' : '+ İzleme Listesi'}
          </button>
        )}
      </div>
    </div>
  )
}
