import type { SpeakApi, LoadChat, SaveChat, DeleteChat, Chat } from './types.ts'
import { get, update } from 'idb-keyval'

let voices: SpeechSynthesisVoice[] = []
while (voices.length === 0) {
  await new Promise(resolve => setTimeout(resolve, 50))
  voices = speechSynthesis.getVoices()
}

export const speak: SpeakApi = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text)
  const voice = voices.find(v => v.lang === 'zh-CN')
  if (voice) {
    utterance.voice = voice
  } else {
    throw new Error('No Chinese voice found')
  }
  utterance.pitch = 0.7 // 音高
  utterance.rate = 1.2 // 语速
  return new Promise<void>(resolve => {
    utterance.onend = () => resolve()
    speechSynthesis.speak(utterance)
  })
}

export const loadChat: LoadChat = async () => {
  const chats = await get<Chat[]>('chats')
  return chats ?? []
}
export const saveChat: SaveChat = async (chat) => {
  await update<Chat[]>('chats', (chats) => [chat, ...(chats ?? [])])
}
export const deleteChat: DeleteChat = async (uuid) => {
  await update<Chat[]>('chats', (chats) => (chats ?? []).filter(chat => chat.uuid !== uuid))
}
