import * as db from 'idb-keyval'

export type ShortTermMemory = {
  role: string
  content: string
  timestamp: number
}

export type LongTermMemory = {
  uuid: string
  start: number
  end: number
  summary: string
}

type StoreKeys = 
  'default_live2d' |
  'default_chat_api' |
  'default_speak_api' |
  'memory_about_self' | // 模型对用户的持久化记忆
  'memory_about_user' | // 模型对自己的持久化记忆
  'long_term_memory' | // 长期记忆, 包含数次对话的总结
  'short_term_memory' // 短期记忆, 包含当前对话的内容

export function get(key: 'default_live2d'): Promise<string | undefined>
export function get(key: 'default_chat_api'): Promise<string | undefined>
export function get(key: 'default_speak_api'): Promise<string | undefined>
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
export function set(key: 'memory_about_self', value: string): Promise<void>
export function set(key: 'memory_about_user', value: string): Promise<void>
export function set(key: 'long_term_memory', value: LongTermMemory[]): Promise<void>
export function set(key: 'short_term_memory', value: ShortTermMemory[]): Promise<void>
export function set(key: StoreKeys, value: string | LongTermMemory[] | ShortTermMemory[]): Promise<void>
export function set(key: StoreKeys, value: string | LongTermMemory[] | ShortTermMemory[]): Promise<void> {
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
