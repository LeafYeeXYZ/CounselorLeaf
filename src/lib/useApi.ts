import type { SpeakApi, LoadLive2d, ChatApi } from './types.ts'
import { create } from 'zustand'
import { chat_ollama } from './api.chat.ts'
import { speak_browser } from './api.speak.ts'
import { catBoy, foxBoy } from './api.live2d.ts'
import { set, get, update } from './api.store.ts'

type API = {
  chat: ChatApi
  speak: SpeakApi | null
  loadLive2d: LoadLive2d
  set: typeof set
  get: typeof get
  update: typeof update
}

type ApiState = {
  speakApiList: string[]
  chatApiList: string[]
  live2dList: string[]
  setSpeakApi: (name: string) => Promise<void>
  setChatApi: (name: string) => Promise<void>
  setLive2d: (name: string) => Promise<void>
  currentSpeakApi: string
  currentChatApi: string
  currentLive2d: string
} & API

const speakApiList: { name: string, api: SpeakApi | null }[] = [
  { name: '关闭', api: null },
  { name: 'Web Speech API', api: speak_browser },
]
const chatApiList: { name: string, api: ChatApi }[] = [
  { name: 'Ollama', api: chat_ollama },
]
const live2dList: { name: string, api: LoadLive2d }[] = [
  { name: '狐狸小叶子', api: foxBoy },
  { name: '猫猫小叶子', api: catBoy },
]

const localSpeakApi = await get('default_speak_api')
const localChatApi = await get('default_chat_api')
const localLive2d = await get('default_live2d')
const defaultSpeakApi = speakApiList.find(({ name }) => name === localSpeakApi) ?? speakApiList[0]
const defaultChatApi = chatApiList.find(({ name }) => name === localChatApi) ?? chatApiList[0]
const defaultLive2d = live2dList.find(({ name }) => name === localLive2d) ?? live2dList[0]

export const useApi = create<ApiState>()((setState) => ({
  set,
  get,
  update,
  speak: defaultSpeakApi.api,
  chat: defaultChatApi.api,
  loadLive2d: defaultLive2d.api,
  speakApiList: speakApiList.map(({ name }) => name),
  chatApiList: chatApiList.map(({ name }) => name),
  live2dList: live2dList.map(({ name }) => name),
  setSpeakApi: async (name) => {
    const item = speakApiList.find(api => api.name === name)
    if (item) {
      setState({ speak: item.api, currentSpeakApi: name })
      await set('default_speak_api', name)
    }
    return
  },
  setChatApi: async (name) => {
    const item = chatApiList.find(api => api.name === name)
    if (item) {
      setState({ chat: item.api, currentChatApi: name })
      await set('default_chat_api', name)
    }
    return
  },
  setLive2d: async (name) => {
    const item = live2dList.find(api => api.name === name)
    if (item) {
      setState({ loadLive2d: item.api, currentLive2d: name })
      await set('default_live2d', name)
    }
    return
  },
  currentSpeakApi: defaultSpeakApi.name,
  currentChatApi: defaultChatApi.name,
  currentLive2d: defaultLive2d.name,
}))
