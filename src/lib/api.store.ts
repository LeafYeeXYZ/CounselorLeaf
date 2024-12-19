import { load } from '@tauri-apps/plugin-store'
import type { Chat } from './types.ts'

const db = await load('data.json')

type StoreKeys = 
  'chats' | 
  'default_live2d' |
  'default_chat_api' |
  'default_speak_api'

export function get(key: 'chats'): Promise<Chat[] | undefined>
export function get(key: 'default_live2d'): Promise<string | undefined>
export function get(key: 'default_chat_api'): Promise<string | undefined>
export function get(key: 'default_speak_api'): Promise<string | undefined>
export function get<T>(key: StoreKeys): Promise<T | undefined> {
  return db.get(key)
}

export function set(key: 'chats', value: Chat[]): Promise<void>
export function set(key: 'default_live2d', value: string): Promise<void>
export function set(key: 'default_chat_api', value: string): Promise<void>
export function set(key: 'default_speak_api', value: string): Promise<void>
export async function set<T>(key: StoreKeys, value: T): Promise<void> {
  await db.set(key, value)
  await db.save()
  return
}

export async function update(key: 'chats', updater: (chats: Chat[]) => Chat[]): Promise<void> {
  const current = await get(key)
  await set(key, updater(current ?? []))
  return
}
