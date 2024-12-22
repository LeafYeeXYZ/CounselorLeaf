export { set, get, save } from './tauri/api.store.ts'
export { chatApiList } from './tauri/api.chat.ts'
export { speakApiList } from './tauri/api.speak.ts'
export { listenApiList } from './tauri/api.listen.ts'
export { live2dList, type LoadLive2d } from './tauri/api.live2d.ts'

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
