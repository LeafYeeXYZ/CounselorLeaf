import * as db from 'idb-keyval'

export function get(key: 'default_live2d'): Promise<string | undefined>
export function get(key: 'default_chat_api'): Promise<string | undefined>
export function get(key: 'default_speak_api'): Promise<string | undefined>
export function get(key: 'last_used_token'): Promise<number | undefined>
export function get(key: 'self_name'): Promise<string | undefined>
export function get(key: 'user_name'): Promise<string | undefined>
export function get(key: 'memory_about_self'): Promise<string | undefined>
export function get(key: 'memory_about_user'): Promise<string | undefined>
export function get(key: 'long_term_memory'): Promise<LongTermMemory[] | undefined>
export function get(key: 'short_term_memory'): Promise<ShortTermMemory[] | undefined>
export function get(key: StoreKeys): Promise<string | number | LongTermMemory[] | ShortTermMemory[] | undefined>
export function get(key: StoreKeys): Promise<string | number | LongTermMemory[] | ShortTermMemory[] | undefined> {
  return db.get(key)
}

export function set(key: 'default_live2d', value: string): Promise<void>
export function set(key: 'default_chat_api', value: string): Promise<void>
export function set(key: 'default_speak_api', value: string): Promise<void>
export function set(key: 'last_used_token', value: number | undefined): Promise<void>
export function set(key: 'self_name', value: string): Promise<void>
export function set(key: 'user_name', value: string): Promise<void>
export function set(key: 'memory_about_self', value: string): Promise<void>
export function set(key: 'memory_about_user', value: string): Promise<void>
export function set(key: 'long_term_memory', value: LongTermMemory[]): Promise<void>
export function set(key: 'short_term_memory', value: ShortTermMemory[]): Promise<void>
export function set(key: StoreKeys, value: undefined | string | number | LongTermMemory[] | ShortTermMemory[]): Promise<void>
export async function set(key: StoreKeys, value: undefined | string | number | LongTermMemory[] | ShortTermMemory[]): Promise<void> {
  return db.set(key, value)
}

export async function save(data: string): Promise<string> {
  // 浏览器环境下使用原生的文件保存对话
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'memory.json'
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 30 * 1000)
  return 'memory.json'
}
