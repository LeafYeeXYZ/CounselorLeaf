import { create } from 'zustand'
import { set, get, speakApiList, chatApiList, live2dList, listenApiList, type Live2dApi, type LoadLive2d } from './utils.ts'

type API = {

  chat: ChatApi
  maxToken: number
  testChat: ChatApiTest
  chatApiList: string[]
  currentChatApi: string
  setChatApi: (name: string) => Promise<void>
  
  speak: SpeakApi | null
  testSpeak: SpeakApiTest | null
  speakApiList: string[]
  currentSpeakApi: string
  setSpeakApi: (name: string) => Promise<void>

  listen: ListenApi | null
  testListen: ListenApiTest | null
  listenApiList: string[]
  currentListenApi: string
  setListenApi: (name: string) => Promise<void>
  
  live2d: Live2dApi | null
  loadLive2d: LoadLive2d
  live2dList: string[]
  currentLive2d: string
  setLoadLive2d: (name: string) => Promise<void>
  setLive2dApi: (api: Live2dApi | null) => Promise<void>
}

const localSpeakApi = await get('default_speak_api')
const localChatApi = await get('default_chat_api')
const localListenApi = await get('default_listen_api')
const localLive2d = await get('default_live2d')
const defaultSpeakApi = speakApiList.find(({ name }) => name === localSpeakApi) ?? speakApiList[0]
const defaultChatApi = chatApiList.find(({ name }) => name === localChatApi) ?? chatApiList[0]
const defaultListenApi = listenApiList.find(({ name }) => name === localListenApi) ?? listenApiList[0]
const defaultLive2d = live2dList.find(({ name }) => name === localLive2d) ?? live2dList[0]

export const useApi = create<API>()((setState) => ({
  chat: defaultChatApi.api,
  maxToken: defaultChatApi.maxToken,
  testChat: defaultChatApi.test,
  speak: defaultSpeakApi.api,
  testSpeak: defaultSpeakApi.test,
  listen: defaultListenApi.api,
  testListen: defaultListenApi.test,
  speakApiList: speakApiList.map(({ name }) => name),
  chatApiList: chatApiList.map(({ name }) => name),
  listenApiList: listenApiList.map(({ name }) => name),
  currentSpeakApi: defaultSpeakApi.name,
  currentChatApi: defaultChatApi.name,
  currentListenApi: defaultListenApi.name,
  live2d: null,
  loadLive2d: defaultLive2d.api,
  live2dList: live2dList.map(({ name }) => name),
  currentLive2d: defaultLive2d.name,
  setSpeakApi: async (name) => {
    const item = speakApiList.find(api => api.name === name)
    if (item) {
      setState({ speak: item.api, currentSpeakApi: name, testSpeak: item.test })
      await set('default_speak_api', name)
    }
    return
  },
  setChatApi: async (name) => {
    const item = chatApiList.find(api => api.name === name)
    if (item) {
      setState({ chat: item.api, currentChatApi: name, testChat: item.test, maxToken: item.maxToken })
      await set('default_chat_api', name)
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
  },
  setLive2dApi: async (api) => {
    setState({ live2d: api })
    return
  },
  setLoadLive2d: async (name) => {
    const item = live2dList.find(api => api.name === name)
    if (item) {
      setState({ loadLive2d: item.api, currentLive2d: name })
      await set('default_live2d', name)
    }
    return
  },
}))
