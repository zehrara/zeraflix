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
  videoUrl: string
  posterUrl: string
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

export const SEED_USER: User = {
  id: 'u0',
  email: 'zehra@test.com',
  password: '123456',
  name: 'Zehra Dilşen',
  createdAt: '2026-01-01T00:00:00.000Z',
}

export const content: Content[] = [
  {
    id: 'c1', title: 'Breaking Bad', type: 'series', genre: 'crime', year: 2008,
    description: 'A chemistry teacher turns to cooking meth after a cancer diagnosis.',
    rating: 9.5, ratingCount: 1, videoUrl: 'https://www.youtube.com/watch?v=FZnD85z9yig',
    posterUrl: 'https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
  },
  {
    id: 'c2', title: 'Inception', type: 'movie', genre: 'sci-fi', year: 2010,
    description: 'A thief who steals corporate secrets through dream-sharing technology.',
    rating: 8.8, ratingCount: 1, videoUrl: 'https://youtu.be/YuPgNaz5-3k',
    posterUrl: 'https://image.tmdb.org/t/p/w500/xn0Kcg4e6p0mLxVS3nAWhNmW2Ni.jpg',
  },
  {
    id: 'c3', title: 'The Dark Knight', type: 'movie', genre: 'action', year: 2008,
    description: 'Batman faces the Joker, a criminal mastermind who plunges Gotham into anarchy.',
    rating: 9.0, ratingCount: 1, videoUrl: 'https://youtu.be/zKNo5W00UvI',
    posterUrl: 'https://image.tmdb.org/t/p/w500/7IPCEr7ifdH5CtU97QG7XgAAtOp.jpg',
  },
  {
    id: 'c4', title: 'Stranger Things', type: 'series', genre: 'sci-fi', year: 2016,
    description: 'Kids encounter supernatural forces and a secret government experiment.',
    rating: 8.7, ratingCount: 1, videoUrl: 'https://youtu.be/FVio-fg4g8I',
    posterUrl: 'https://image.tmdb.org/t/p/w500/hjVNQA2a12OxkpDEOQTBMbKVZ1K.jpg',
  },
  {
    id: 'c5', title: 'Interstellar', type: 'movie', genre: 'sci-fi', year: 2014,
    description: "Explorers travel through a wormhole in space to ensure humanity's survival.",
    rating: 8.6, ratingCount: 1, videoUrl: 'https://youtu.be/fBm2djOTYTQ',
    posterUrl: 'https://image.tmdb.org/t/p/w500/xbiycuc84TrieEWwkkuH2hoEa9S.jpg',
  },
  {
    id: 'c6', title: 'The Crown', type: 'series', genre: 'drama', year: 2016,
    description: "The political rivalries and romance of Queen Elizabeth II's reign.",
    rating: 8.2, ratingCount: 1, videoUrl: 'https://youtu.be/rW_neOTS_98',
    posterUrl: 'https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg',
  },
  {
    id: 'c7', title: "One Summer's Day", type: 'movie', genre: 'müzik', year: 2001,
    description: 'Spirited Away filminden Joe Hisaishi imzalı unutulmaz tema.',
    rating: 9.4, ratingCount: 1, videoUrl: 'https://youtu.be/TK1Ij_-mank',
    posterUrl: 'https://img.youtube.com/vi/TK1Ij_-mank/maxresdefault.jpg',
  },
  {
    id: 'c8', title: 'Merry-Go-Round of Life', type: 'movie', genre: 'müzik', year: 2004,
    description: "Howl's Moving Castle teması, Grissini Project yorumuyla.",
    rating: 9.2, ratingCount: 1, videoUrl: 'https://youtu.be/J6qIzKxmW8Y',
    posterUrl: 'https://img.youtube.com/vi/J6qIzKxmW8Y/maxresdefault.jpg',
  },
  {
    id: 'c9', title: 'Evgeny Grinko - Valse', type: 'movie', genre: 'müzik', year: 2012,
    description: 'Modern klasik piyano: melankolik ve zarif bir vals.',
    rating: 9.0, ratingCount: 1, videoUrl: 'https://youtu.be/VYCOg-yglNM',
    posterUrl: 'https://img.youtube.com/vi/VYCOg-yglNM/maxresdefault.jpg',
  },
  {
    id: 'c10', title: "The Cruel Angel's Thesis", type: 'series', genre: 'anime', year: 1995,
    description: 'Neon Genesis Evangelion açılış teması, efsanevi anime şarkısı.',
    rating: 9.1, ratingCount: 1, videoUrl: 'https://www.youtube.com/watch?v=o6wtDPVkKqI',
    posterUrl: 'https://image.tmdb.org/t/p/w500/AhtWPHqIT1cWdrKTZVDMZD4Ca4F.jpg',
  },
  {
    id: 'c11', title: "Aragorn's Battle Speech", type: 'movie', genre: 'sahne', year: 2003,
    description: 'Yüzüklerin Efendisi: Kara Kapı önünde Aragornun konuşması.',
    rating: 9.3, ratingCount: 1, videoUrl: 'https://www.youtube.com/watch?v=SwMUY5ro5Xo',
    posterUrl: 'https://image.tmdb.org/t/p/w500/qwigzi0gOcXZRxbm488wT31t2UZ.jpg',
  },
  {
    id: 'c12', title: 'Uykusuzluk', type: 'movie', genre: 'müzik', year: 2020,
    description: 'Sakin, atmosferik bir müzik parçası.',
    rating: 8.8, ratingCount: 1, videoUrl: 'https://youtu.be/wFeOqB88x1k',
    posterUrl: 'https://img.youtube.com/vi/wFeOqB88x1k/maxresdefault.jpg',
  },
  {
    id: 'c13', title: 'Her Gün Seninle', type: 'movie', genre: 'müzik', year: 2021,
    description: 'Duygusal, dingin bir şarkı.',
    rating: 8.7, ratingCount: 1, videoUrl: 'https://www.youtube.com/watch?v=J73RG-6yFts',
    posterUrl: 'https://img.youtube.com/vi/J73RG-6yFts/maxresdefault.jpg',
  },
  {
    id: 'c14', title: 'Peacecore', type: 'movie', genre: 'müzik', year: 2022,
    description: 'Huzur veren, sakinleştirici bir müzik atmosferi.',
    rating: 8.6, ratingCount: 1, videoUrl: 'https://www.youtube.com/watch?v=uLEUnDJ95pc',
    posterUrl: 'https://img.youtube.com/vi/uLEUnDJ95pc/maxresdefault.jpg',
  },
  {
    id: 'c15', title: 'Kitten Sneeze', type: 'movie', genre: 'video', year: 2019,
    description: 'Sevimli bir kedi yavrusunun hapşırması.',
    rating: 9.9, ratingCount: 1, videoUrl: 'https://youtu.be/d4HwO3ZUCUw',
    posterUrl: 'https://img.youtube.com/vi/d4HwO3ZUCUw/maxresdefault.jpg',
  },
  {
    id: 'c16', title: 'Nosferatu Vogueing', type: 'movie', genre: 'video', year: 2023,
    description: 'Eğlenceli, viral bir kısa video.',
    rating: 8.5, ratingCount: 1, videoUrl: 'https://youtu.be/Jr58Uf1srfo',
    posterUrl: 'https://img.youtube.com/vi/Jr58Uf1srfo/maxresdefault.jpg',
  },
  {
    id: 'c17', title: 'A Raccoon Tries to Catch Falling Snow', type: 'movie', genre: 'video', year: 2021,
    description: 'Kar tanelerini yakalamaya çalışan sevimli bir rakun.',
    rating: 9.6, ratingCount: 1, videoUrl: 'https://youtu.be/jfd9CDbB548',
    posterUrl: 'https://img.youtube.com/vi/jfd9CDbB548/maxresdefault.jpg',
  },
]
