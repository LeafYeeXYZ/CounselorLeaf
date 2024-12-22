import { load } from '@tauri-apps/plugin-store'
import { save as _save } from '@tauri-apps/plugin-dialog'
import { invoke } from '@tauri-apps/api/core'

const db = await load('data.json')

export function get(key: 'default_live2d'): Promise<string | undefined>
export function get(key: 'default_chat_api'): Promise<string | undefined>
export function get(key: 'default_speak_api'): Promise<string | undefined>
export function get(key: 'self_name'): Promise<string | undefined>
export function get(key: 'user_name'): Promise<string | undefined>
export function get(key: 'memory_about_self'): Promise<string | undefined>
export function get(key: 'memory_about_user'): Promise<string | undefined>
export function get(key: 'long_term_memory'): Promise<LongTermMemory[] | undefined>
export function get(key: 'short_term_memory'): Promise<ShortTermMemory[] | undefined>
export function get(key: StoreKeys): Promise<string | LongTermMemory[] | ShortTermMemory[] | undefined>
export function get(key: StoreKeys): Promise<string | LongTermMemory[] | ShortTermMemory[] | undefined> {
  return db.get(key)
}

export function set(key: 'default_live2d', value: string): Promise<void>
export function set(key: 'default_chat_api', value: string): Promise<void>
export function set(key: 'default_speak_api', value: string): Promise<void>
export function set(key: 'self_name', value: string): Promise<void>
export function set(key: 'user_name', value: string): Promise<void>
export function set(key: 'memory_about_self', value: string): Promise<void>
export function set(key: 'memory_about_user', value: string): Promise<void>
export function set(key: 'long_term_memory', value: LongTermMemory[]): Promise<void>
export function set(key: 'short_term_memory', value: ShortTermMemory[]): Promise<void>
export function set(key: StoreKeys, value: string | LongTermMemory[] | ShortTermMemory[]): Promise<void>
export async function set(key: StoreKeys, value: string | LongTermMemory[] | ShortTermMemory[]): Promise<void> {
  await db.set(key, value)
  await db.save()
  return
}

export async function save(data: string): Promise<string> {
  const path = await _save({
    title: '保存记忆',
    defaultPath: 'memory.json',
    filters: [
      { name: 'JSON', extensions: ['json'] },
      { name: 'TXT', extensions: ['txt'] },
    ],
  })
  if (!path) throw new Error('取消保存')
  return invoke('save_memory', { path, data })
}
