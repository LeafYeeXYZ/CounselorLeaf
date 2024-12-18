import type { SpeakApi, ChatApi, LoadLive2d, LoadChat, SaveChat, DeleteChat, API, Chat } from './types.ts'
import ollama from 'ollama/browser'
import { loadOml2d } from 'oh-my-live2d'
import { get, update } from 'idb-keyval'

let voices: SpeechSynthesisVoice[] = []
while (voices.length === 0) {
  await new Promise(resolve => setTimeout(resolve, 50))
  voices = speechSynthesis.getVoices()
}

const speak: SpeakApi = (text: string) => {
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

const model = 'qwen2.5:7b'
const prompt = '你是一个心理咨询师, 名叫小叶子. 请你以支持的, 非指导性的方式陪伴对方, 帮助对方探索自己, 并在需要时提供帮助. 请不要回复长的和正式的内容, 避免说教, 表现得像一个真实、专业、共情的心理咨询师. 再次提醒: 回复务必要简短!'

const chat: ChatApi = (messages) => {
  return Promise.resolve(_chat(messages))
}
const _chat = async function* (messages: { role: string, content: string }[]) {
  const response = await ollama.chat({
    model,
    messages: [{ role: 'system', content: prompt }, ...messages],
    stream: true,
  })
  for await (const chunk of response) {
    if (chunk.done) {
      yield { response: chunk.message.content ?? '', done: true }
    } else {
      yield { response: chunk.message.content ?? '', done: false }
    }
  }
}

const loadLive2d: LoadLive2d = (element) => {
  const live2d = loadOml2d({
    parentElement: element,
    dockedPosition: 'right',
    menus: { disable: true },
    sayHello: false,
    tips: {
      style: {
        minWidth: '200px',
      }
    },
    models: [
      {
        path: 'https://model.oml2d.com/cat-white/model.json',
        position: [0, 20],
      }
    ],
  })
  return {
    stop: () => live2d.clearTips(),
    say: (text: string) => live2d.tipsMessage(text, 10000, Date.now()),
    remove: () => { 
      element.innerHTML = '' 
    },
  }
}

const loadChat: LoadChat = async () => {
  const chats = await get<Chat[]>('chats')
  return chats ?? []
}
const saveChat: SaveChat = async (chat) => {
  await update<Chat[]>('chats', (chats) => [chat, ...(chats ?? [])])
}
const deleteChat: DeleteChat = async (uuid) => {
  await update<Chat[]>('chats', (chats) => (chats ?? []).filter(chat => chat.uuid !== uuid))
}

const api: API = {
  speak,
  chat,
  loadLive2d,
  loadChat,
  saveChat,
  deleteChat,
}

export default api
