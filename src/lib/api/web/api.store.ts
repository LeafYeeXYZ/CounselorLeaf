import * as db from 'idb-keyval'

export function get(key: 'long_term_memory'): Promise<LongTermMemory[] | undefined>
export function get(key: 'short_term_memory'): Promise<ShortTermMemory[] | undefined>
export function get(key: 'archived_memory'): Promise<ArchivedMemory[] | undefined>
export function get(key: StoreKeys): Promise<string | undefined>
export function get(key: StoreKeys): Promise<unknown> {
  return db.get(key)
}

export function set(key: 'long_term_memory', value: LongTermMemory[]): Promise<void>
export function set(key: 'short_term_memory', value: ShortTermMemory[]): Promise<void>
export function set(key: 'archived_memory', value: ArchivedMemory[]): Promise<void>
export function set(key: StoreKeys, value: string): Promise<void>
export async function set(key: StoreKeys, value: unknown): Promise<void> {
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
