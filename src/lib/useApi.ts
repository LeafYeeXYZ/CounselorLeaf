import type { SpeakApi, LoadLive2d, LoadChat, SaveChat, DeleteChat, ChatApi } from './types.ts'
import { create } from 'zustand'
import { 
  chat as chat_ollama 
} from './api.ollama.ts'
import { 
  loadChat as loadChat_browser, 
  saveChat as saveChat_browser, 
  deleteChat as deleteChat_browser,
  speak as speak_browser,
} from './api.browser.ts'
import {
  catBoy as live2d_cat,
  blueBoy as live2d_blue,
} from './api.live2d.ts'

type API = {
  chat: ChatApi
  speak: SpeakApi | null
  loadLive2d: LoadLive2d
  loadChat: LoadChat
  saveChat: SaveChat
  deleteChat: DeleteChat
}

type ApiState = {
  speakApiList: string[]
  storeApiList: string[]
  chatApiList: string[]
  live2dList: string[]
  setSpeakApi: (name: string) => void
  setStoreApi: (name: string) => void
  setChatApi: (name: string) => void
  setLive2d: (name: string) => void
  currentSpeakApi: string
  currentStoreApi: string
  currentChatApi: string
  currentLive2d: string
} & API

const speakApiList: { name: string, api: SpeakApi | null }[] = [
  { name: '关闭', api: null },
  { name: 'Web Speech API', api: speak_browser },
]
const storeApiList: { name: string, load: LoadChat, save: SaveChat, delete: DeleteChat }[] = [
  { name: 'IndexedDB', load: loadChat_browser, save: saveChat_browser, delete: deleteChat_browser },
]
const chatApiList: { name: string, api: ChatApi }[] = [
  { name: 'Ollama', api: chat_ollama },
]
const live2dList: { name: string, api: LoadLive2d }[] = [
  { name: '猫猫小叶子', api: live2d_cat },
  { name: '校园小叶子', api: live2d_blue },
]

export const useApi = create<ApiState>()((set) => {
  const localSpeakApi = localStorage.getItem('speakApi')
  const localStoreApi = localStorage.getItem('storeApi')
  const localChatApi = localStorage.getItem('chatApi')
  const localLive2d = localStorage.getItem('live2d')
  const defaultSpeakApi = speakApiList.find(({ name }) => name === localSpeakApi) ?? speakApiList[0]
  const defaultStoreApi = storeApiList.find(({ name }) => name === localStoreApi) ?? storeApiList[0]
  const defaultChatApi = chatApiList.find(({ name }) => name === localChatApi) ?? chatApiList[0]
  const defaultLive2d = live2dList.find(({ name }) => name === localLive2d) ?? live2dList[0]
  return {
    speak: defaultSpeakApi.api,
    loadChat: defaultStoreApi.load,
    saveChat: defaultStoreApi.save,
    deleteChat: defaultStoreApi.delete,
    chat: defaultChatApi.api,
    loadLive2d: defaultLive2d.api,
    speakApiList: speakApiList.map(({ name }) => name),
    storeApiList: storeApiList.map(({ name }) => name),
    chatApiList: chatApiList.map(({ name }) => name),
    live2dList: live2dList.map(({ name }) => name),
    setSpeakApi: (name) => {
      const item = speakApiList.find(api => api.name === name)
      if (item) set({ speak: item.api, currentSpeakApi: name })
    },
    setStoreApi: (name) => {
      const item = storeApiList.find(api => api.name === name)
      if (item) set({ loadChat: item.load, saveChat: item.save, deleteChat: item.delete, currentStoreApi: name })
    },
    setChatApi: (name) => {
      const item = chatApiList.find(api => api.name === name)
      if (item) set({ chat: item.api, currentChatApi: name })
    },
    setLive2d: (name) => {
      const item = live2dList.find(api => api.name === name)
      if (item) set({ loadLive2d: item.api, currentLive2d: name })
    },
    currentSpeakApi: defaultSpeakApi.name,
    currentStoreApi: defaultStoreApi.name,
    currentChatApi: defaultChatApi.name,
    currentLive2d: defaultLive2d.name,
  }
})
