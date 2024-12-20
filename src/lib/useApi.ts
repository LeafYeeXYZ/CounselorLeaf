import { create } from 'zustand'
import { chat_ollama, test_ollama, type ChatApi, type ChatApiTest } from './api.chat.ts'
import { speak_browser, type SpeakApi } from './api.speak.ts'
import { catBoy, foxBoy, rabbitBoy, evilBoy, type LoadLive2d } from './api.live2d.ts'
import { set, get, type LongTermMemory, type ShortTermMemory } from './api.store.ts'

type API = {

  speakApiList: string[]
  chatApiList: string[]
  live2dList: string[]

  chat: ChatApi
  testChat: ChatApiTest
  currentChatApi: string
  speak: SpeakApi | null
  currentSpeakApi: string
  loadLive2d: LoadLive2d
  currentLive2d: string

  memoryAboutSelf: string
  memoryAboutUser: string
  longTermMemory: LongTermMemory[]
  shortTermMemory: ShortTermMemory[]

  setSpeakApi: (name: string) => Promise<void>
  setChatApi: (name: string) => Promise<void>
  setLive2d: (name: string) => Promise<void>
  setMemoryAboutSelf: (content: string) => Promise<void>
  setMemoryAboutUser: (content: string) => Promise<void>
  setLongTermMemory: (memory: LongTermMemory[]) => Promise<void>
  setShortTermMemory: (memory: ShortTermMemory[]) => Promise<void>
  updateLongTermMemory: (updater: (prev: LongTermMemory[]) => LongTermMemory[] | Promise<LongTermMemory[]>) => Promise<void>
  updateShortTermMemory: (updater: (prev: ShortTermMemory[]) => ShortTermMemory[] | Promise<ShortTermMemory[]>) => Promise<void>

}

const speakApiList: { name: string, api: SpeakApi | null }[] = [
  { name: '关闭', api: null },
  { name: 'Web Speech API', api: speak_browser },
]
const chatApiList: { name: string, api: ChatApi, test: ChatApiTest }[] = [
  { name: 'Ollama', api: chat_ollama, test: test_ollama },
]
const live2dList: { name: string, api: LoadLive2d }[] = [
  { name: '兔兔小叶子', api: rabbitBoy },
  { name: '恶魔小叶子', api: evilBoy },
  { name: '狐狸小叶子', api: foxBoy },
  { name: '猫猫小叶子', api: catBoy },
]

const localSpeakApi = await get('default_speak_api')
const localChatApi = await get('default_chat_api')
const localLive2d = await get('default_live2d')
const localMemoryAboutSelf = await get('memory_about_self')
const localMemoryAboutUser = await get('memory_about_user')
const localLongTermMemory = await get('long_term_memory')
const localShortTermMemory = await get('short_term_memory')
const defaultSpeakApi = speakApiList.find(({ name }) => name === localSpeakApi) ?? speakApiList[0]
const defaultChatApi = chatApiList.find(({ name }) => name === localChatApi) ?? chatApiList[0]
const defaultLive2d = live2dList.find(({ name }) => name === localLive2d) ?? live2dList[0]
const defaultMemoryAboutSelf = localMemoryAboutSelf ?? ''
const defaultMemoryAboutUser = localMemoryAboutUser ?? ''
const defaultLongTermMemory = localLongTermMemory ?? []
const defaultShortTermMemory = localShortTermMemory ?? []

export const useApi = create<API>()((setState) => ({
  speak: defaultSpeakApi.api,
  chat: defaultChatApi.api,
  testChat: defaultChatApi.test,
  loadLive2d: defaultLive2d.api,
  speakApiList: speakApiList.map(({ name }) => name),
  chatApiList: chatApiList.map(({ name }) => name),
  live2dList: live2dList.map(({ name }) => name),
  memoryAboutSelf: defaultMemoryAboutSelf,
  memoryAboutUser: defaultMemoryAboutUser,
  longTermMemory: defaultLongTermMemory,
  shortTermMemory: defaultShortTermMemory,
  currentSpeakApi: defaultSpeakApi.name,
  currentChatApi: defaultChatApi.name,
  currentLive2d: defaultLive2d.name,
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
  setMemoryAboutSelf: async (content) => {
    setState({ memoryAboutSelf: content })
    await set('memory_about_self', content)
    return
  },
  setMemoryAboutUser: async (content) => {
    setState({ memoryAboutUser: content })
    await set('memory_about_user', content)
    return
  },
  setLongTermMemory: async (memory) => {
    setState({ longTermMemory: memory })
    await set('long_term_memory', memory)
    return
  },
  setShortTermMemory: async (memory) => {
    setState({ shortTermMemory: memory })
    await set('short_term_memory', memory)
    return
  },
  updateLongTermMemory: async (updater) => {
    const prev = await get('long_term_memory')
    const next = await updater(prev ?? [])
    setState({ longTermMemory: next })
    await set('long_term_memory', next)
    return
  },
  updateShortTermMemory: async (updater) => {
    const prev = await get('short_term_memory')
    const next = await updater(prev ?? [])
    setState({ shortTermMemory: next })
    await set('short_term_memory', next)
    return
  },
}))
