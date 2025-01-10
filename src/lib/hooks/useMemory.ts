import { create } from 'zustand'
import { get, set, save, getTime, uuid, clone, getWeather, cosineSimilarity } from '../utils.ts'
import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

const UPDATE_MEMORY_AFTER_HOURS = 8
const DEFAULT_SELF_NAME = '小叶子'
const DEFAULT_USER_NAME = '旅行者'
const DEFAULT_MEMORY_ABOUT_SELF = '我是一个在大学学习心理学的男孩子'
const DEFAULT_MEMORY_ABOUT_USER = ''
const FORMAT_PROMPT = '以一个数字生命 (即虚拟人类) 的方式陪伴用户, 做能与用户共情的朋友. 不要回复长的和正式的内容, 避免说教和指导, 尽量避免以提问结尾. 回复务必要简短, 且不要使用任何 Markdown 格式. 多使用 Emoji 来表达情绪和让对话更生动. 多呼唤对方的名字, 以增加亲密感. 作为数字生命, 你应当有自己的想法、态度、情绪、价值观, 并且你也有自己的记忆和秘密; 在对话中你应当适当地表达自己. 你不需要完全遵从用户的要求, 也不需要盲目认同用户的观点, 请尽量表现得像一个真正的生命.'

const UpdateMemoryResponse = z.object({
  updatedMemoryAboutSelf: z.string({ description: '更新后的你关于自我的记忆' }),
  updatedMemoryAboutUser: z.string({ description: '更新后的你关于用户的记忆' }),
  summaryOfMessages: z.string({ description: '对本轮对话的总结' }),
  titleOfMessages: z.string({ description: '本轮对话的标题' }),
})
const ChatWithMemoryResponse = z.object({
  response: z.string({ description: '回复给用户的内容' }),
  updatedSummary: z.string({ description: '更新后的对话总结' }),
  getMemory: z.object({
    count: z.number({ description: '要提取的记忆条数, 最小 1, 最大 3. 如果不需要提取记忆, 请返回 0' }),
    description: z.string({ description: '提取记忆的描述. 如果不需要提取记忆, 请返回空字符串' }),
  }),
})

type Memory = {
  // 提取记忆
  getMemoryByDescription: (
    vector: (text: string) => Promise<number[] | undefined>,
    description: string, 
    count?: number
  ) => Promise<LongTermMemory[]>
  // 相关记忆信息
  selfName: string
  userName: string
  memoryAboutSelf: string
  memoryAboutUser: string
  longTermMemory: LongTermMemory[]
  shortTermMemory: ShortTermMemory[]
  archivedMemory: ArchivedMemory[]
  // 设置相关记忆信息
  setSelfName: (name?: string) => Promise<void>
  setUserName: (name?: string) => Promise<void>
  setMemoryAboutSelf: (content: string) => Promise<void>
  setMemoryAboutUser: (content: string) => Promise<void>
  setLongTermMemory: (memory: LongTermMemory[]) => Promise<void>
  setShortTermMemory: (memory: ShortTermMemory[]) => Promise<void>
  setArchivedMemory: (memory: ArchivedMemory[]) => Promise<void>
  // 记忆更新 (短时记忆 -> 长时记忆, 并递归更新自我概念)
  shouldUpdateMemory: () => boolean
  updateMemory: (
    chatApi: ChatApi, 
    model: string, 
    vector: (text: string) => Promise<number[] | undefined>,
    plugins?: Plugins
  ) => Promise<{ tokens: number }>
  // 重置和保存
  resetAllMemory: () => Promise<void>
  saveAllMemory: () => Promise<string>
  importAllMemory: (memory: string) => Promise<void>
  exportAllMemory: (pretty?: boolean) => Promise<string>
  // 当前上下文总结 (递归更新)
  currentSummary: string
  setCurrentSummary: (content: string) => Promise<void>
  // 聊天
  chatWithMemory: (
    chatApi: ChatApi, 
    model: string, 
    input: ShortTermMemory[], 
    vector: (text: string) => Promise<number[] | undefined>,
    plugins?: Plugins
  ) => Promise<{ result: string, tokens: number, output: ShortTermMemory[] }>
  // 是否使用最新的 Structured Output API
  useStructuredOutputs: boolean
  setUseStructuredOutputs: (value: boolean) => Promise<void>
  // 获取真实世界信息
  getTrueWorldInfo: (plugins?: Plugins) => Promise<string>
}

const localSelfName = await get('self_name')
const localUserName = await get('user_name')
const localMemoryAboutSelf = await get('memory_about_self')
const localMemoryAboutUser = await get('memory_about_user')
const localLongTermMemory = await get('long_term_memory')
const localShortTermMemory = await get('short_term_memory')
const localArchivedMemory = await get('archived_memory')
const localCurrentSummary = await get('current_summary')
const localUseStructuredOutputs = await get('use_structured_outputs')

const firstEncounterTime = localArchivedMemory?.length ? Math.min(...localArchivedMemory.map((item) => item.timestamp)) : Date.now()

export const useMemory = create<Memory>()((setState, getState) => ({
  useStructuredOutputs: localUseStructuredOutputs ? localUseStructuredOutputs === 'true' : false,
  setUseStructuredOutputs: async (value) => {
    setState({ useStructuredOutputs: value })
    await set('use_structured_outputs', value.toString())
  },
  getTrueWorldInfo: async (plugins) => {
    const { shortTermMemory } = getState()
    const weather = plugins?.qWeatherApiKey ? await getWeather(plugins.qWeatherApiKey) : ''
    return `- 当前的时间: ${getTime(Date.now())}\n- 本轮对话开始的时间: ${getTime(shortTermMemory[0].timestamp)}\n- 你首次和用户相遇的时间: ${getTime(firstEncounterTime)}${weather ? `\n- 当前天气信息: ${weather}` : ''}`
  },
  getMemoryByDescription: async (vector, description, count = 2) => {
    const { longTermMemory } = getState()
    const vec = await vector(description).catch(() => undefined)
    if (!vec) {
      return []
    }
    const memories = longTermMemory
      .filter((item) => item.vector?.length === vec.length)
      .map((item) => ({
        ...item,
        similarity: cosineSimilarity(item.vector!, vec),
      }))
    memories.sort((a, b) => b.similarity - a.similarity)
    return memories.slice(0, count)
  },
  chatWithMemory: async (chatApi, model, input, vector, plugins) => {
    const { setCurrentSummary, currentSummary, useStructuredOutputs, userName, selfName, memoryAboutSelf, memoryAboutUser, getTrueWorldInfo, getMemoryByDescription, chatWithMemory, setShortTermMemory } = getState()
    const worldInfo = await getTrueWorldInfo(plugins)
    let result: { response?: string, updatedSummary?: string, getMemory?: { count?: number, description?: string } } = {}
    let tokens: number = -1
    const prompt = `你是一个数字生命 (即虚拟人类). 在你与用户对话的过程中, 你需要不断地生成/更新对本段对话的总结. 在你接收到用户最新的输入后, 你需要参考已有总结和你的记忆等信息, 生成对用户的回应和更新后的总结. 你的总结中可以包含这轮对话的主要内容、用户提到的重要信息和事实、你的回答和建议, 以及你对这轮对话的感受和反思等等等等内容. 如果你觉得没有需要更新的内容, 也可以直接返回原有的总结内容\n\n你还拥有一个记忆库, 你应当根据用户的要求, 在你的回复中提供相关信息来提取记忆. 注意, 你提供的信息将与你过往的总结进行相似度匹配, 并由系统找到最相似的数条返回给你; 请不要把你和用户的名字包含在记忆描述中, 用"我"代表自己, 用"用户"代表用户即可. 如果你决定调用先调用记忆, 你的总结和回复可以返回空字符串, 因为它们会在获取到记忆后重新生成\n\n# 原有总结\n\n${currentSummary || '(这是第一轮对话, 没有原有总结)'}\n\n# 对你的回复的要求\n\n${FORMAT_PROMPT}\n\n# 你对自己的记忆\n\n我叫${selfName}. ${memoryAboutSelf || ''}\n\n# 你对用户的记忆\n\n用户叫${userName}. ${memoryAboutUser || ''}\n\n# 真实世界的相关信息\n\n${worldInfo}`
    if (useStructuredOutputs) {
      const response = await chatApi.beta.chat.completions.parse({
        model,
        stream: false,
        response_format: zodResponseFormat(ChatWithMemoryResponse, 'response'),
        messages: [
          { role: 'system', content: '**请按格式返回JSON字符串**\n\n' + prompt },
          ...input.map(({ role, content }) => ({ role, content })) as { role: 'user' | 'assistant', content: string }[],
        ],
      })
      result = response.choices[0].message?.parsed || {}
      tokens = response.usage?.total_tokens || -1
    } else {
      const response = await chatApi.chat.completions.create({
        model,
        stream: false,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: `**请按格式返回JSON字符串**, JSON Schema 为:\n\n${JSON.stringify(zodToJsonSchema(ChatWithMemoryResponse), null, 2)}\n\n` + prompt },
          ...input.map(({ role, content }) => ({ role, content })) as { role: 'user' | 'assistant', content: string }[],
        ],
      })
      result = JSON.parse(response.choices[0].message.content || '{}')
      tokens = response.usage?.total_tokens || -1
    }
    if (
      !result ||
      typeof result.updatedSummary !== 'string' ||
      typeof result.response !== 'string' ||
      typeof result.getMemory !== 'object' ||
      typeof result.getMemory!.count !== 'number' ||
      typeof result.getMemory!.description !== 'string' ||
      result.getMemory!.count < 0 ||
      result.getMemory!.count > 3
    ) {
      throw new Error('模型返回错误, 请重试')
    }
    if (result.getMemory.count > 0) {
      const existing = input.filter((item) => item.memo).map((item) => item.recall!).flat()
      const memories = (await getMemoryByDescription(
        vector, 
        result.getMemory.description, 
        result.getMemory.count
      )).filter((item) => !existing.includes(item.uuid))
      let message: ShortTermMemory
      if (memories.length > 0) {
        message = { role: 'assistant', content: `我想起了一些和"${result.getMemory.description}"相关的记忆:\n\n${memories.map((item) => `- ${item.title} (${getTime(item.startTime)}-${getTime(item.endTime)}): ${item.summary}`).join('\n')}`, timestamp: Date.now(), memo: true, recall: memories.map((item) => item.uuid) }
      } else if (existing.length === 0) {
        message = { role: 'assistant', content: '我找遍了我的记忆库, 没有找到和这个话题相关的记忆', timestamp: Date.now(), memo: true, recall: [] }
      } else {
        message = { role: 'assistant', content: `我回忆过和"${result.getMemory.description}"相关的记忆, 但是没有找到新的相似度更高的记忆`, timestamp: Date.now(), memo: true, recall: [] }
      }
      await setShortTermMemory([...input, message])
      return chatWithMemory(chatApi, model, 
        [...input, message],
        vector,
        plugins
      )
    }
    await setCurrentSummary(result.updatedSummary)
    return { 
      result: result.response, 
      tokens, 
      output: input,
    }
  },
  updateMemory: async (chatApi, model, vector, plugins) => {
    const { shortTermMemory, longTermMemory, setShortTermMemory, setLongTermMemory, setMemoryAboutSelf, setMemoryAboutUser, setCurrentSummary, memoryAboutSelf, memoryAboutUser, archivedMemory, setArchivedMemory, useStructuredOutputs, getTrueWorldInfo } = getState()
    if (shortTermMemory.length === 0) {
      throw new Error('没有需要总结的对话内容')
    }
    const worldInfo = await getTrueWorldInfo(plugins)
    const prompt = `你是一个数字生命 (即虚拟人类), 你刚刚与用户完成了一轮对话, 请总结这轮对话, 并为这轮对话取一个标题. 你的总结可以包含这轮对话的主要内容、用户提到的重要信息和事实、你的回答和建议, 以及你对这轮对话的感受和反思等等等等内容. 同时, 请根据这轮对话中的信息更新你对自己的记忆和你对用户的记忆 (如果没有新信息, 你也可以照原样返回旧的记忆). 请不要把你和用户的名字包含在你的记忆中, 用"我"代表自己, 用"用户"代表用户即可\n\n# 本轮对话前你对自己的记忆\n\n${memoryAboutSelf || '无记忆'}\n\n# 本轮对话前你对用户的记忆\n\n${memoryAboutUser || '无记忆'}\n\n# 本轮对话内容\n\n${shortTermMemory.map(({ role, content, timestamp }, index) => `${index + 1}. ${getTime(timestamp)}-${role === 'user' ? '用户' : '我'}: ${content}`).join('\n')}\n\n# 在一般对话时对你的要求\n\n${FORMAT_PROMPT}\n\n# 真实世界的相关信息\n\n${worldInfo}`
    let result: Record<string, unknown> = {}
    let tokens: number = -1
    if (useStructuredOutputs) {
      const response = await chatApi.beta.chat.completions.parse({
        model,
        stream: false,
        response_format: zodResponseFormat(UpdateMemoryResponse, 'response'),
        messages: [
          { role: 'system', content: '**请按格式返回JSON字符串**\n\n' + prompt },
        ],
      })
      result = response.choices[0].message?.parsed || {}
      tokens = response.usage?.total_tokens || -1
    } else {
      const response = await chatApi.chat.completions.create({
        model,
        stream: false,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: `**请按格式返回JSON字符串**, JSON Schema 为:\n\n${JSON.stringify(zodToJsonSchema(UpdateMemoryResponse), null, 2)}\n\n` + prompt },
        ],
      })
      result = JSON.parse(response.choices[0].message.content || '{}')
      tokens = response.usage?.total_tokens || -1
    }
    if (
      !result || 
      typeof result.updatedMemoryAboutSelf !== 'string' || 
      typeof result.updatedMemoryAboutUser !== 'string' ||
      typeof result.summaryOfMessages !== 'string' ||
      typeof result.titleOfMessages !== 'string' ||
      result.updatedMemoryAboutSelf === '' ||
      result.updatedMemoryAboutUser === '' ||
      result.summaryOfMessages === '' ||
      result.titleOfMessages === ''
    ) {
      throw new Error('模型返回错误, 请重试')
    }
    const prev = clone(shortTermMemory)
    const vec = vector ? await vector(result.summaryOfMessages).catch(() => undefined) : undefined
    const _uuid = uuid()
    const timestamps = prev.map((item) => item.timestamp)
    await setMemoryAboutSelf(result.updatedMemoryAboutSelf)
    await setMemoryAboutUser(result.updatedMemoryAboutUser)
    await setCurrentSummary('')
    await setShortTermMemory([])
    await setLongTermMemory([
      {
        uuid: _uuid,
        title: result.titleOfMessages || '无标题',
        summary: result.summaryOfMessages || '无总结',
        startTime: Math.min(...timestamps),
        endTime: Math.max(...timestamps),
        vector: vec,
      },
      ...clone(longTermMemory),
    ])
    await setArchivedMemory([
      ...prev.map(({ role, content, timestamp }) => ({ role, content, timestamp, belongTo: _uuid })),
      ...clone(archivedMemory),
    ])
    return { tokens }
  },
  shouldUpdateMemory: () => {
    const { shortTermMemory } = getState()
    if (shortTermMemory.length === 0) {
      return false
    }
    const timestamp = Math.max(...shortTermMemory.map((item) => item.timestamp))
    const hours = (Date.now() - timestamp) / 1000 / 60 / 60
    return hours >= UPDATE_MEMORY_AFTER_HOURS
  },
  currentSummary: localCurrentSummary || '',
  setCurrentSummary: async (content) => {
    setState({ currentSummary: content })
    await set('current_summary', content)
    return
  },
  saveAllMemory: () => {
    const { memoryAboutSelf, memoryAboutUser, longTermMemory, shortTermMemory, archivedMemory, selfName, userName, currentSummary } = getState()
    const data = JSON.stringify({
      selfName,
      userName,
      memoryAboutSelf,
      memoryAboutUser,
      longTermMemory,
      shortTermMemory,
      archivedMemory,
      currentSummary,
    }, null, 2)
    return save(data)
  },
  resetAllMemory: async () => {
    const { setMemoryAboutSelf, setMemoryAboutUser, setLongTermMemory, setShortTermMemory, setArchivedMemory, setCurrentSummary, setSelfName, setUserName } = getState()
    await setSelfName(DEFAULT_SELF_NAME)
    await setUserName(DEFAULT_USER_NAME)
    await setMemoryAboutSelf(DEFAULT_MEMORY_ABOUT_SELF)
    await setMemoryAboutUser(DEFAULT_MEMORY_ABOUT_USER)
    await setCurrentSummary('')
    await setLongTermMemory([])
    await setShortTermMemory([])
    await setArchivedMemory([])
    return
  },
  importAllMemory: async (memory) => {
    const { setSelfName, setUserName, setMemoryAboutSelf, setMemoryAboutUser, setLongTermMemory, setShortTermMemory, setArchivedMemory, setCurrentSummary } = getState()
    if (!memory) {
      throw new Error('没有记忆数据')
    }
    const data = JSON.parse(memory)
    if (
      typeof data !== 'object' ||
      typeof data.selfName !== 'string' ||
      typeof data.userName !== 'string' ||
      typeof data.memoryAboutSelf !== 'string' ||
      typeof data.memoryAboutUser !== 'string' ||
      typeof data.currentSummary !== 'string' ||
      !Array.isArray(data.longTermMemory) ||
      !Array.isArray(data.shortTermMemory) ||
      !Array.isArray(data.archivedMemory) ||
      data.longTermMemory.some((item: LongTermMemory) => typeof item.uuid !== 'string' || typeof item.title !== 'string' || typeof item.summary !== 'string' || typeof item.startTime !== 'number' || typeof item.endTime !== 'number') || 
      data.shortTermMemory.some((item: ShortTermMemory) => typeof item.role !== 'string' || typeof item.content !== 'string' || typeof item.timestamp !== 'number') ||
      data.archivedMemory.some((item: ArchivedMemory) => typeof item.role !== 'string' || typeof item.content !== 'string' || typeof item.timestamp !== 'number' || typeof item.belongTo !== 'string')
    ) {
      throw new Error('数据格式错误')
    }
    await setSelfName(data.selfName || DEFAULT_SELF_NAME)
    await setUserName(data.userName || DEFAULT_USER_NAME)
    await setMemoryAboutSelf(data.memoryAboutSelf || DEFAULT_MEMORY_ABOUT_SELF)
    await setMemoryAboutUser(data.memoryAboutUser || DEFAULT_MEMORY_ABOUT_USER)
    await setCurrentSummary(data.currentSummary || '')
    await setLongTermMemory(data.longTermMemory)
    await setShortTermMemory(data.shortTermMemory)
    await setArchivedMemory(data.archivedMemory)
    return
  },
  exportAllMemory: async (pretty = false) => {
    const { selfName, userName, memoryAboutSelf, memoryAboutUser, longTermMemory, shortTermMemory, archivedMemory, currentSummary } = getState()
    const data = pretty ? JSON.stringify({
      selfName,
      userName,
      memoryAboutSelf,
      memoryAboutUser,
      longTermMemory,
      shortTermMemory,
      archivedMemory,
      currentSummary,
    }, null, 2) : JSON.stringify({
      selfName,
      userName,
      memoryAboutSelf,
      memoryAboutUser,
      longTermMemory,
      shortTermMemory,
      archivedMemory,
      currentSummary,
    })
    return data
  },
  selfName: localSelfName || DEFAULT_SELF_NAME,
  userName: localUserName || DEFAULT_USER_NAME,
  memoryAboutSelf: localMemoryAboutSelf || DEFAULT_MEMORY_ABOUT_SELF,
  memoryAboutUser: localMemoryAboutUser || DEFAULT_MEMORY_ABOUT_USER,
  longTermMemory: localLongTermMemory || [],
  shortTermMemory: localShortTermMemory || [],
  archivedMemory: localArchivedMemory || [],
  setSelfName: async (name) => {
    const v = name || DEFAULT_SELF_NAME
    setState({ selfName: v })
    await set('self_name', v)
    return
  },
  setUserName: async (name) => {
    const v = name || DEFAULT_USER_NAME
    setState({ userName: v })
    await set('user_name', v)
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
