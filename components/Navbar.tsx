'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [loggedIn, setLoggedIn] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const check = () => setLoggedIn(!!localStorage.getItem('token'))
    check()
    window.addEventListener('storage', check)
    return () => window.removeEventListener('storage', check)
  }, [pathname])

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setLoggedIn(false)
    router.push('/login')
  }

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors hover:text-white ${
      pathname === href ? 'text-white' : 'text-zinc-400'
    }`

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm border-b border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-black tracking-widest text-[#E50914] shrink-0">
          ZERAFLIX
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className={linkClass('/')}>Ana Sayfa</Link>
          <Link href="/search" className={linkClass('/search')}>Arama</Link>
          <Link href="/recommendations" className={linkClass('/recommendations')}>Öneriler</Link>
          <Link href="/watchlist" className={linkClass('/watchlist')}>İzleme Listesi</Link>
          <Link href="/history" className={linkClass('/history')}>Geçmiş</Link>
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {loggedIn ? (
            <>
              <Link href="/profile" className={linkClass('/profile')}>Profil</Link>
              <button
                onClick={logout}
                className="px-4 py-1.5 text-sm font-medium bg-[#E50914] text-white rounded hover:bg-red-700 transition-colors"
              >
                Çıkış
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass('/login')}>Giriş</Link>
              <Link
                href="/register"
                className="px-4 py-1.5 text-sm font-medium bg-[#E50914] text-white rounded hover:bg-red-700 transition-colors"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-zinc-400 hover:text-white p-1"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menü"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/95 border-t border-zinc-800 px-4 py-4 flex flex-col gap-3">
          {[
            { href: '/', label: 'Ana Sayfa' },
            { href: '/search', label: 'Arama' },
            { href: '/recommendations', label: 'Öneriler' },
            { href: '/watchlist', label: 'İzleme Listesi' },
            { href: '/history', label: 'Geçmiş' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={linkClass(href)}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <hr className="border-zinc-800" />
          {loggedIn ? (
            <>
              <Link href="/profile" className={linkClass('/profile')} onClick={() => setMenuOpen(false)}>Profil</Link>
              <button onClick={logout} className="text-left text-sm text-[#E50914] font-medium">Çıkış Yap</button>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass('/login')} onClick={() => setMenuOpen(false)}>Giriş</Link>
              <Link href="/register" className={linkClass('/register')} onClick={() => setMenuOpen(false)}>Kayıt Ol</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
