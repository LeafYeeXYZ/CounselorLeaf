import { create } from 'zustand'
import { uuid } from './utils.ts'
import { chat_ollama, test_ollama, type ChatApi, type ChatApiTest } from './api.chat.ts'
import { speak_browser, type SpeakApi } from './api.speak.ts'
import { catBoy, foxBoy, rabbitBoy, evilBoy, bearBoy, sickBoy, type LoadLive2d } from './api.live2d.ts'
import { set, get, save, type LongTermMemory, type ShortTermMemory } from './api.store.ts'

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

  resetAllMemory: () => Promise<void>
  saveAllMemory: () => Promise<string>
  shortMemoToLong: () => Promise<void>
  // longMemoToLong: (uuid: string[]) => Promise<void>

  formatPrompt: string
  getPrompt: () => string

}

const speakApiList: { name: string, api: SpeakApi | null }[] = [
  { name: '关闭', api: null },
  { name: 'Web Speech API', api: speak_browser },
]
const chatApiList: { name: string, api: ChatApi, test: ChatApiTest }[] = [
  { name: 'Ollama - qwen2.5:7b', api: chat_ollama, test: test_ollama },
]
const live2dList: { name: string, api: LoadLive2d }[] = [
  { name: '恶魔小叶子', api: evilBoy },
  { name: '病娇小叶子', api: sickBoy },
  { name: '兔兔小叶子', api: rabbitBoy },
  { name: '狐狸小叶子', api: foxBoy },
  { name: '熊熊小叶子', api: bearBoy },
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

const DEFAULT_MEMORY_ABOUT_SELF = '我是一个心理学专业的本科生, 男性, 名叫小叶子.'
const DEFAULT_MEMORY_ABOUT_USER = ''
const DEFAULT_LONG_TERM_MEMORY: LongTermMemory[] = []
const DEFAULT_SHORT_TERM_MEMORY: ShortTermMemory[] = []

export const useApi = create<API>()((setState, getState) => ({
  shortMemoToLong: async () => {
    const { 
      shortTermMemory, 
      updateLongTermMemory,
      memoryAboutSelf, 
      memoryAboutUser, 
      chat 
    } = getState()
    const timestamps = shortTermMemory.map((item) => item.timestamp)
    const memory = {
      uuid: uuid(),
      start: Math.min(...timestamps),
      end: Math.max(...timestamps),
      summary: 'TODO',
    }
    console.log({ memoryAboutSelf, memoryAboutUser, chat })
    return updateLongTermMemory((prev) => [memory, ...prev])
  },
  getPrompt: () => {
    const { formatPrompt, memoryAboutSelf, memoryAboutUser } = getState()
    return `你是一个虚拟人类, 下面是你的记忆和对你的要求:\n\n# 你对自己的记忆\n${memoryAboutSelf || '(无)'}\n\n# 你对用户的记忆\n${memoryAboutUser || '(无)'}\n\n# 对你的要求\n${formatPrompt}`
  },
  formatPrompt: '以支持、温柔、可爱的方式陪伴对方. 不要回复长的和正式的内容, 避免说教和指导. 表现得像一个真实和共情的朋友. 回复务必要简短, 且不要使用任何 Markdown 格式. 多使用 Emoji 来表达情绪和让对话更生动.',
  saveAllMemory: () => {
    const { memoryAboutSelf, memoryAboutUser, longTermMemory, shortTermMemory } = getState()
    const data = JSON.stringify({
      memoryAboutSelf,
      memoryAboutUser,
      longTermMemory,
      shortTermMemory,
    }, null, 2)
    return save(data)
  },
  resetAllMemory: async () => {
    const { setMemoryAboutSelf, setMemoryAboutUser, setLongTermMemory, setShortTermMemory } = getState()
    await setMemoryAboutSelf('')
    await setMemoryAboutUser('')
    await setLongTermMemory([])
    await setShortTermMemory([])
    return
  },
  chat: defaultChatApi.api,
  speak: defaultSpeakApi.api,
  testChat: defaultChatApi.test,
  loadLive2d: defaultLive2d.api,
  speakApiList: speakApiList.map(({ name }) => name),
  chatApiList: chatApiList.map(({ name }) => name),
  live2dList: live2dList.map(({ name }) => name),
  memoryAboutSelf: localMemoryAboutSelf || DEFAULT_MEMORY_ABOUT_SELF,
  memoryAboutUser: localMemoryAboutUser || DEFAULT_MEMORY_ABOUT_USER,
  longTermMemory: localLongTermMemory || DEFAULT_LONG_TERM_MEMORY,
  shortTermMemory: localShortTermMemory || DEFAULT_SHORT_TERM_MEMORY,
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
