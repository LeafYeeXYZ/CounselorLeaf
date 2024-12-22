import { create } from 'zustand'
import { set, get, speakApiList, chatApiList, live2dList, listenApiList, type LoadLive2d } from './utils.ts'

type API = {

  listenApiList: string[]
  speakApiList: string[]
  chatApiList: string[]
  live2dList: string[]

  chat: ChatApi
  testChat: ChatApiTest
  currentChatApi: string
  speak: SpeakApi | null
  testSpeak: SpeakApiTest | null
  currentSpeakApi: string
  listen: ListenApi | null
  testListen: ListenApiTest | null
  currentListenApi: string

  loadLive2d: LoadLive2d
  currentLive2d: string

  setSpeakApi: (name: string) => Promise<void>
  setChatApi: (name: string) => Promise<void>
  setLive2d: (name: string) => Promise<void>
  setListenApi: (name: string) => Promise<void>
}

const localSpeakApi = await get('default_speak_api')
const localChatApi = await get('default_chat_api')
const localLive2d = await get('default_live2d')
const localListenApi = await get('default_listen_api')
const defaultSpeakApi = speakApiList.find(({ name }) => name === localSpeakApi) ?? speakApiList[0]
const defaultChatApi = chatApiList.find(({ name }) => name === localChatApi) ?? chatApiList[0]
const defaultLive2d = live2dList.find(({ name }) => name === localLive2d) ?? live2dList[0]
const defaultListenApi = listenApiList.find(({ name }) => name === localListenApi) ?? listenApiList[0]

export const useApi = create<API>()((setState) => ({
  chat: defaultChatApi.api,
  testChat: defaultChatApi.test,
  speak: defaultSpeakApi.api,
  testSpeak: defaultSpeakApi.test,
  listen: defaultListenApi.api,
  testListen: defaultListenApi.test,
  loadLive2d: defaultLive2d.api,
  speakApiList: speakApiList.map(({ name }) => name),
  chatApiList: chatApiList.map(({ name }) => name),
  live2dList: live2dList.map(({ name }) => name),
  listenApiList: listenApiList.map(({ name }) => name),
  currentSpeakApi: defaultSpeakApi.name,
  currentChatApi: defaultChatApi.name,
  currentLive2d: defaultLive2d.name,
  currentListenApi: defaultListenApi.name,
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
      setState({ chat: item.api, currentChatApi: name, testChat: item.test })
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
  setListenApi: async (name) => {
    const item = listenApiList.find(api => api.name === name)
    if (item) {
      setState({ listen: item.api, currentListenApi: name, testListen: item.test })
      await set('default_listen_api', name)
    }
    return
  }
}))
