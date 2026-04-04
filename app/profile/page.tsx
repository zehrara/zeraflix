'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'

interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [form, setForm] = useState({ name: '', password: '' })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) { router.push('/login'); return }
    const u = JSON.parse(stored) as User
    setUser(u)
    setForm({ name: u.name, password: '' })
  }, [router])

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)

    const body: Record<string, string> = {}
    if (form.name && form.name !== user?.name) body.name = form.name
    if (form.password) body.password = form.password

    if (Object.keys(body).length === 0) {
      setError('Değiştirilecek bir alan giriniz.')
      setLoading(false)
      return
    }

    const res = await apiFetch('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(body),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) { setError(data.error ?? 'Güncelleme başarısız'); return }

    const updatedUser = { ...user, ...data.user }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setForm({ name: updatedUser.name, password: '' })
    setSuccess('Profil güncellendi.')
  }

  async function handleDelete() {
    const res = await apiFetch('/api/profile', { method: 'DELETE' })
    if (res.ok) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.dispatchEvent(new Event('storage'))
      router.push('/')
    }
  }

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Profil</h1>

      {/* User info card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-[#E50914] flex items-center justify-center text-white text-xl font-bold shrink-0">
            {user.name[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-white font-semibold text-lg">{user.name}</p>
            <p className="text-zinc-400 text-sm">{user.email}</p>
            <p className="text-zinc-600 text-xs mt-0.5">
              Kayıt: {new Date(user.createdAt).toLocaleDateString('tr-TR')}
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">İsim</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#E50914] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">
              Yeni Şifre <span className="text-zinc-600">(boş bırakırsan değişmez)</span>
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm placeholder-zinc-600 focus:outline-none focus:border-[#E50914] transition-colors"
            />
          </div>

          {error && (
            <p className="text-[#E50914] text-sm bg-red-950/40 border border-red-900/50 rounded-lg px-4 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-400 text-sm bg-green-950/40 border border-green-900/50 rounded-lg px-4 py-2">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="py-3 bg-[#E50914] hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="bg-zinc-900 border border-red-900/40 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-red-400 mb-2">Tehlikeli Alan</h2>
        <p className="text-zinc-500 text-sm mb-4">
          Hesabını silersen tüm veriler kalıcı olarak silinir.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-5 py-2.5 border border-red-700 text-red-400 hover:bg-red-900/30 rounded-lg text-sm font-medium transition-colors"
          >
            Hesabı Sil
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="px-5 py-2.5 bg-[#E50914] hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Evet, hesabımı sil
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              İptal
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
