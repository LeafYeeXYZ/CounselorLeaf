export { chatApiList } from './shared/api.chat.ts'
export { speakApiList } from './shared/api.speak.ts'
export { listenApiList } from './shared/api.listen.ts'
export { set, get, save } from './tauri/api.store.ts'
export { live2dList, type LoadLive2d, type Live2dApi } from './tauri/api.live2d.ts'

/**
 * 获取时间: XXXX年X月X日X时X分X秒
 * @param timestamp 时间戳, 默认为当前时间
 * @returns 时间字符串
 */
export function getTime(timestamp?: number) {
  const date = new Date(timestamp ?? Date.now())
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日${date.getHours()}时${date.getMinutes()}分${date.getSeconds()}秒`
}

/**
 * 获取日期: XXXX年X月X日
 * @param timestamp 时间戳, 默认为当前时间
 * @returns 日期字符串
 */
export function getDate(timestamp?: number) {
  const date = new Date(timestamp ?? Date.now())
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

export function toBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
  return btoa(binary)
}

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}
