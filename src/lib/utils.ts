export { set, get, save } from './tauri/api.store.ts'
export { chatApiList } from './tauri/api.chat.ts'
export { speakApiList } from './tauri/api.speak.ts'
export { listenApiList } from './tauri/api.listen.ts'
export { live2dList, type LoadLive2d, type Live2dApi } from './tauri/api.live2d.ts'

export async function shortMemoToLong({
  chatApi,
  memoryAboutSelf,
  memoryAboutUser,
  shortTermMemories,
} : {
  chatApi: ChatApi,
  memoryAboutSelf: string,
  memoryAboutUser: string,
  shortTermMemories: ShortTermMemory[],
}): Promise<{
  memoryAboutSelf: string,
  memoryAboutUser: string,
  longTermMemory: LongTermMemory,
}> {
  console.log({ memoryAboutSelf, memoryAboutUser, shortTermMemories, chatApi })
  throw new Error('Not implemented')
}

export async function longMemoToLong({
  chatApi,
  memoryAboutSelf,
  memoryAboutUser,
  longTermMemories,
} : {
  chatApi: ChatApi,
  memoryAboutSelf: string,
  memoryAboutUser: string,
  longTermMemories: LongTermMemory[],
}): Promise<{
  memoryAboutSelf: string,
  memoryAboutUser: string,
  longTermMemory: LongTermMemory,
}> {
  console.log({ memoryAboutSelf, memoryAboutUser, longTermMemories, chatApi })
  throw new Error('Not implemented')
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
