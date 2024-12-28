import { create } from 'zustand'
import { get, set, save, getTime } from './utils.ts'

type Memory = {

  selfName: string
  userName: string
  memoryAboutSelf: string
  memoryAboutUser: string
  longTermMemory: LongTermMemory[]
  shortTermMemory: ShortTermMemory[]
  archivedMemory: ArchivedMemory[]

  setSelfName: (name: string) => Promise<void>
  setUserName: (name: string) => Promise<void>
  setMemoryAboutSelf: (content: string) => Promise<void>
  setMemoryAboutUser: (content: string) => Promise<void>
  setLongTermMemory: (memory: LongTermMemory[]) => Promise<void>
  setShortTermMemory: (memory: ShortTermMemory[]) => Promise<void>
  setArchivedMemory: (memory: ArchivedMemory[]) => Promise<void>

  resetAllMemory: () => Promise<void>
  saveAllMemory: () => Promise<string>

  getPrompt: () => string
}

const DEFAULT_SELF_NAME = '小叶子'
const DEFAULT_USER_NAME = '旅行者'
const DEFAULT_MEMORY_ABOUT_SELF = '我是一个心理学专业的本科生, 男性.'
const DEFAULT_MEMORY_ABOUT_USER = ''
const FORMAT_PROMPT = '以支持、温柔、可爱的方式陪伴对方. 不要回复长的和正式的内容, 避免说教和指导, 避免总是以提问结尾. 表现得像一个真实和共情的朋友. 回复务必要简短, 且不要使用任何 Markdown 格式. 多使用 Emoji 来表达情绪和让对话更生动. 多呼唤对方的名字, 以增加亲密感.'

const localSelfName = await get('self_name')
const localUserName = await get('user_name')
const localMemoryAboutSelf = await get('memory_about_self')
const localMemoryAboutUser = await get('memory_about_user')
const localLongTermMemory = await get('long_term_memory')
const localShortTermMemory = await get('short_term_memory')
const localArchivedMemory = await get('archived_memory')

export const useMemory = create<Memory>()((setState, getState) => ({
  getPrompt: () => {
    const { memoryAboutSelf, memoryAboutUser, selfName, userName } = getState()
    return `你是一个虚拟人类, 下面是你的记忆和对你的要求:\n\n# 你对自己的记忆\n\n我叫${selfName}. ${memoryAboutSelf || '(无)'}\n\n# 你对用户的记忆\n\n用户叫${userName}. ${memoryAboutUser || '(无)'}\n\n# 对你的要求\n\n${FORMAT_PROMPT}\n\n> 当前的实时时间: ${getTime()}`
  },
  saveAllMemory: () => {
    const { memoryAboutSelf, memoryAboutUser, longTermMemory, shortTermMemory, archivedMemory, selfName, userName } = getState()
    const data = JSON.stringify({
      selfName,
      userName,
      memoryAboutSelf,
      memoryAboutUser,
      longTermMemory,
      shortTermMemory,
      archivedMemory,
    }, null, 2)
    return save(data)
  },
  resetAllMemory: async () => {
    const { setMemoryAboutSelf, setMemoryAboutUser, setLongTermMemory, setShortTermMemory, setArchivedMemory } = getState()
    await setMemoryAboutSelf('')
    await setMemoryAboutUser('')
    await setLongTermMemory([])
    await setShortTermMemory([])
    await setArchivedMemory([])
    return
  },
  selfName: localSelfName || DEFAULT_SELF_NAME,
  userName: localUserName || DEFAULT_USER_NAME,
  memoryAboutSelf: localMemoryAboutSelf || DEFAULT_MEMORY_ABOUT_SELF,
  memoryAboutUser: localMemoryAboutUser || DEFAULT_MEMORY_ABOUT_USER,
  longTermMemory: localLongTermMemory || [],
  shortTermMemory: localShortTermMemory || [],
  archivedMemory: localArchivedMemory || [],
  setSelfName: async (name) => {
    name = name || DEFAULT_SELF_NAME
    setState({ selfName: name })
    await set('self_name', name)
    return
  },
  setUserName: async (name) => {
    name = name || DEFAULT_USER_NAME
    setState({ userName: name })
    await set('user_name', name)
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
  setArchivedMemory: async (memory) => {
    setState({ archivedMemory: memory })
    await set('archived_memory', memory)
    return
  },
}))
