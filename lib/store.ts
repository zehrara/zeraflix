export interface User {
  id: string
  email: string
  password: string
  name: string
  createdAt: string
}

export interface Content {
  id: string
  title: string
  type: 'movie' | 'series'
  genre: string
  year: number
  description: string
  rating: number
  ratingCount: number
}

export interface WatchlistEntry {
  userId: string
  contentId: string
  addedAt: string
}

export interface RatingEntry {
  userId: string
  contentId: string
  rating: number
}

export interface HistoryEntry {
  userId: string
  contentId: string
  watchedAt: string
}

// In-memory store — persists for the lifetime of the Node.js process
const store: {
  users: User[]
  content: Content[]
  watchlist: WatchlistEntry[]
  ratings: RatingEntry[]
  history: HistoryEntry[]
} = {
  users: [],
  content: [
    {
      id: 'c1',
      title: 'Breaking Bad',
      type: 'series',
      genre: 'crime',
      year: 2008,
      description: 'A chemistry teacher turns to cooking meth after a cancer diagnosis.',
      rating: 9.5,
      ratingCount: 1,
    },
    {
      id: 'c2',
      title: 'Inception',
      type: 'movie',
      genre: 'sci-fi',
      year: 2010,
      description: 'A thief who steals corporate secrets through dream-sharing technology.',
      rating: 8.8,
      ratingCount: 1,
    },
    {
      id: 'c3',
      title: 'The Dark Knight',
      type: 'movie',
      genre: 'action',
      year: 2008,
      description: 'Batman faces the Joker, a criminal mastermind who plunges Gotham into anarchy.',
      rating: 9.0,
      ratingCount: 1,
    },
    {
      id: 'c4',
      title: 'Stranger Things',
      type: 'series',
      genre: 'sci-fi',
      year: 2016,
      description: 'Kids encounter supernatural forces and a secret government experiment.',
      rating: 8.7,
      ratingCount: 1,
    },
    {
      id: 'c5',
      title: 'Interstellar',
      type: 'movie',
      genre: 'sci-fi',
      year: 2014,
      description: 'Explorers travel through a wormhole in space to ensure humanity\'s survival.',
      rating: 8.6,
      ratingCount: 1,
    },
    {
      id: 'c6',
      title: 'The Crown',
      type: 'series',
      genre: 'drama',
      year: 2016,
      description: 'The political rivalries and romance of Queen Elizabeth II\'s reign.',
      rating: 8.2,
      ratingCount: 1,
    },
  ],
  watchlist: [],
  ratings: [],
  history: [],
}

export default store

let nextUserId = 1
export function generateUserId(): string {
  return `u${nextUserId++}`
}
