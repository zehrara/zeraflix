import { Redis } from '@upstash/redis'
import { SEED_USER, type User } from './store'

export const redis = Redis.fromEnv()

export async function getCollection<T>(key: string): Promise<T[]> {
  const data = await redis.get<T[]>(key)
  return data ?? []
}

export async function setCollection<T>(key: string, value: T[]): Promise<void> {
  await redis.set(key, value)
}

// Users koleksiyonu boşsa seed user'ı otomatik ekler
export async function getUsers(): Promise<User[]> {
  const users = await getCollection<User>('users')
  if (users.length === 0) {
    await setCollection('users', [SEED_USER])
    return [SEED_USER]
  }
  return users
}
