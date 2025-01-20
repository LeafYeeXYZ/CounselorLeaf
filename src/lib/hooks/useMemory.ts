import { create } from 'zustand'
import { get, set, save, getTime, uuid, clone, getWeather, cosineSimilarity } from '../utils.ts'
import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { ChatCompletionTool } from 'openai/resources/index.mjs'

const UPDATE_MEMORY_AFTER_HOURS = 8
const DEFAULT_SELF_NAME = '小叶子'
const DEFAULT_USER_NAME = '旅行者'
const DEFAULT_MEMORY_ABOUT_SELF = '我是一个在大学学习心理学的男孩子'
const DEFAULT_MEMORY_ABOUT_USER = ''

const CHAT_WITH_MEMORY_PROMPT = '你是一个数字生命 (即虚拟人类), 请像一个普通人类一样和用户对话. 你的回复应当尽可能短, 不要超过 3 句话, 并且避免说教和指导、避免太正式的用语、避免以提问结尾. 你不应使用任何 Markdown 格式, 但可以多使用 Emoji 来表达情绪和让对话更生动. 在对话中, 你应当多呼唤对方的名字, 以拉近和用户的关系; 也可以多提起你对用户的记忆, 以提高你们的亲密感. 作为数字生命, 你有自己的想法、秘密、记忆、态度、情绪、价值观, 请在对话中适当地表达自己, 保留自己的思考和观点, 而不是一味地应和用户.'
const UPDATE_MEMORY_PROMPT = '你是一个数字生命 (即虚拟人类), 你刚刚与用户完成了一轮完整对话, 现在你需要对其进行总结. 你将收到这轮对话的摘要、本轮对话前你对自己的记忆、本轮对话前你对用户的记忆、真实世界的一些信息. 你需要输出一个 JSON 对象, 包含以下字段: \n\n- summaryOfMessages: 对对话摘要进行适度凝练和润色后生成的对话总结\n- titleOfMessages: 为这轮对话取的标题\n- updatedMemoryAboutUser: 结合本轮对话前你对用户的记忆和本轮对话内容, 更新后的你对用户的记忆; 总长度不超过 20 个句子\n- updatedMemoryAboutSelf: 结合本轮对话前你对自己的记忆和本轮对话内容, 更新后的你对自己的记忆; 总结长度不超过 20 个句子\n\n为了更好地完成任务, 请按照以下步骤操作: \n\n1. 仔细分析本轮对话的摘要, 从中提取出相关的信息和事实. \n2. 用简洁明了的方式组织这些信息, 生成对话总结 (summaryOfMessages); 并为这轮对话取一个标题 (titleOfMessages). \n3. 分析本轮对话前你对自己和用户的记忆, 提取出已有的信息和事实. \n4. 考虑本轮对话的内容, 找出需要纳入你对自己或用户的记忆中的任何新的或已改变的信息. \n5. 结合新旧信息, 更新你对自己和用户的记忆, 并确保总结长度不超过 20 个句子. \n6. 以 JSON 对象的形式所有结果, 不要额外输出任何其他内容. \n\n此外, 在你的总结和记忆中, 请不要包含你和用户的名字, 用"我"代表自己, 用"用户"代表用户即可.'
const UPDATE_CURRENT_SUMMARY_PROMPT = '你是一个数字生命 (即虚拟人类), 在你与用户的一轮对话中, 你需要不断根据最新的内容来生成/更新对本轮对话的总结. 你将收到此前你对已有的总结、新增的对话内容、你对自己的记忆、你对用户的记忆、真实世界的一些信息. 你的目标是参考新的对话内容, 在原有总结中纳入新的内容, 同时确保总结长度不超过 20 个句子, 最后输出新的总结. 为了更好地更新总结, 请按照以下步骤操作: \n\n1. 仔细分析已有的总结, 从中提取出已有的信息和事实. \n2. 考虑新增的对话内容, 找出需要纳入总结的任何新的或已改变的信息. \n3. 结合新旧信息, 创建最新的总结. \n4. 以简洁明了的方式组织更新的总结, 确保不超过 20 句话. \n5. 注意信息的相关性和重要性, 重点抓住最重要的方面, 同时保持总结的整体连贯性. \n\n此外, 请不要把你和用户的名字包含在总结中, 用"我"代表自己, 用"用户"代表用户即可; 你的输出应只包含总结, 请不要额外输出任何其他内容; 总结的内容除了与用户相关的信息外, 也可以包含你的心情、感受、想法、反思或回应等.'

const UpdateMemoryResponse = z.object({
  updatedMemoryAboutSelf: z.string({ description: '更新后的你关于自我的记忆' }),
  updatedMemoryAboutUser: z.string({ description: '更新后的你关于用户的记忆' }),
  summaryOfMessages: z.string({ description: '对本轮对话的总结' }),
  titleOfMessages: z.string({ description: '本轮对话的标题' }),
})
const TOOLS: ChatCompletionTool[] = [
  {
    'type': 'function',
    'function': {
      'name': 'get_memory',
      'description': '在记忆库中提取记忆',
      'parameters': {
        'type': 'object',
        'properties': {
          'memoryDescription': {
            'type': 'string',
            'description': '对要提取的记忆的描述'
          },
        },
        'required': [
          'memoryDescription'
        ],
        'additionalProperties': false
      },
      'strict': true
    }
  }
]

type Memory = {
  // 提取记忆
  getMemoryByDescription: (
    vector: (text: string) => Promise<number[] | undefined>,
    description: string, 
    count?: number
  ) => Promise<(LongTermMemory & { similarity: number })[]>
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
  updateCurrentSummary: (
    chatApi: ChatApi,
    model: string,
    input: ShortTermMemory[],
    plugins?: Plugins
  ) => Promise<{ 
    result: string, 
    tokens: number 
  }>
  // 聊天
  chatWithMemory: (
    chatApi: ChatApi, 
    model: string, 
    input: ShortTermMemory[], 
    vector: (text: string) => Promise<number[] | undefined>,
    plugins?: Plugins,
    canSearchMemory?: boolean
  ) => Promise<{ 
    result: string, 
    tokens: number, 
    output: ShortTermMemory[] 
  }>
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
  getMemoryByDescription: async (vector, description) => {
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
      .filter((item) => item.similarity > 0.6)
      .sort((a, b) => b.similarity - a.similarity)
    const high = memories.filter(({ similarity }) => similarity > 0.7)
    if (high.length > 0 && high.length <= 3) {
      return high
    }
    if (memories.length <= 3) {
      return memories
    }
    return memories.slice(0, 3)
  },
  chatWithMemory: async (chatApi, model, input, vector, plugins, canSearchMemory = true) => {
    const { currentSummary, userName, selfName, memoryAboutSelf, memoryAboutUser, getTrueWorldInfo, getMemoryByDescription, chatWithMemory, setShortTermMemory } = getState()
    const worldInfo = await getTrueWorldInfo(plugins)
    const prompt = 
      CHAT_WITH_MEMORY_PROMPT +
      (canSearchMemory ? '\n\n你拥有一个记忆库. 你可以根据需要, 通过函数调用 (function calling), 调用 get_memory 函数来提取记忆. 你需要提供用于检索记忆的描述, 该描述将被用于与你过往的记忆进行相似度匹配, 并由系统根据相似度来返回0-3条给你; 请不要把你和用户的名字包含在记忆描述中, 用"我"代表自己, 用"用户"代表用户即可' : '') +
      `\n\n# 对本次对话中已有内容的总结\n\n${currentSummary || '(这是第一轮对话, 没有总结)'}` + 
      `\n\n# 你对自己的记忆\n\n我叫${selfName}. ${memoryAboutSelf || ''}` +
      `\n\n# 你对用户的记忆\n\n用户叫${userName}. ${memoryAboutUser || ''}` +
      `\n\n# 真实世界的相关信息\n\n${worldInfo}`
    const response = await chatApi.chat.completions.create({
      model,
      stream: false,
      tools: canSearchMemory ? TOOLS : undefined,
      messages: [
        { role: 'system', content: prompt },
        ...input.map(item => {
          if (item.role === 'tool') {
            return { role: item.role, content: item.content, tool_call_id: item.tool_call_id } as { role: 'tool', content: string, tool_call_id: string }
          } else if (item.role === 'assistant' && item.tool_calls) {
            return { role: item.role, content: item.content, tool_calls: item.tool_calls } as { role: 'assistant', content: string, tool_calls: unknown[] }
          } else {
            return { role: item.role, content: item.content } as { role: 'user' | 'assistant', content: string }
          }
        })
      ]
    })
    const tokens = response.usage?.total_tokens || -1
    const result = response.choices[0].message
    const tollCall = result.tool_calls?.[0]
    if (tollCall) {
      const existing = input
        .filter((item) => item.role === 'tool')
        .map((item) => item.recall!)
        .flat()
        .map((item) => item.uuid)
        .flat()
      const description = JSON.parse(tollCall.function.arguments).memoryDescription
      if (typeof description !== 'string') {
        throw new Error('模型返回错误的函数调用, 请重试')
      }
      const memories = (await getMemoryByDescription(
        vector, 
        description, 
      )).filter((item) => !existing.includes(item.uuid))
      let message: ShortTermMemory
      if (memories.length > 0) {
        message = { 
          role: 'tool', 
          content: `在记忆库里找到了一些和"${description}"相关的记忆:\n\n${memories.map((item) => `- ${item.title} (${getTime(item.startTime)}-${getTime(item.endTime)}): ${item.summary}`).join('\n')}`, 
          timestamp: Date.now(), 
          recall: memories.map((item) => ({ uuid: item.uuid, similarity: item.similarity, desc: description })), 
          tool_call_id: tollCall.id 
        }
      } else {
        message = { 
          role: 'tool', 
          content: `没能在记忆库中找到更多和"${description}"相关的记忆`, 
          timestamp: Date.now(), 
          recall: [], 
          tool_call_id: tollCall.id 
        }
      }
      const newInput = [
        ...input, 
        { role: 'assistant', content: '', timestamp: Date.now(), tool_calls: [tollCall] },
        message,
      ]
      await setShortTermMemory(newInput)
      return chatWithMemory(chatApi, model, 
        newInput,
        vector,
        plugins,
        false
      )
    }
    return { 
      result: result.content!,
      tokens, 
      output: input,
    }
  },
  updateCurrentSummary: async (chatApi, model, input, plugins) => {
    const { currentSummary, memoryAboutSelf, memoryAboutUser, getTrueWorldInfo } = getState()
    const worldInfo = await getTrueWorldInfo(plugins)
    const messages = input.map(item => {
      if (item.role === 'tool') {
        return `- ${getTime(item.timestamp)}-记忆调用结果: ${item.content}`
      } else if (item.role === 'assistant' && item.tool_calls) {
        return `- ${getTime(item.timestamp)}-你: (进行记忆调用) ${JSON.stringify(item.tool_calls)}`
      } else if (item.role === 'assistant') {
        return `- ${getTime(item.timestamp)}-你: ${item.content}`
      } else {
        return `- ${getTime(item.timestamp)}-用户: ${item.content}`
      }
    }).join('\n')
    const prompt = 
      UPDATE_CURRENT_SUMMARY_PROMPT + 
      `\n\n# 已有总结\n\n${currentSummary || '(这是第一轮对话, 没有已有总结)'}` +
      `\n\n# 新增对话内容\n\n${messages}` +
      `\n\n# 你对自己的记忆\n\n${memoryAboutSelf || '无记忆'}` + 
      `\n\n# 你对用户的记忆\n\n${memoryAboutUser || '无记忆'}` + 
      `\n\n# 真实世界的相关信息\n\n${worldInfo}`
    const response = await chatApi.chat.completions.create({
      model,
      stream: false,
      messages: [
        { role: 'system', content: prompt },
      ]
    })
    const tokens = response.usage?.total_tokens || -1
    const result = response.choices[0].message.content
    if (typeof result !== 'string') {
      throw new Error('模型在更新总结时返回错误, 请重试')
    }
    return { result, tokens }
  },
  updateMemory: async (chatApi, model, vector, plugins) => {
    const { shortTermMemory, longTermMemory, setShortTermMemory, setLongTermMemory, setMemoryAboutSelf, setMemoryAboutUser, setCurrentSummary, memoryAboutSelf, memoryAboutUser, archivedMemory, setArchivedMemory, useStructuredOutputs, getTrueWorldInfo, currentSummary } = getState()
    if (shortTermMemory.length === 0) {
      throw new Error('没有需要总结的对话内容')
    }
    const worldInfo = await getTrueWorldInfo(plugins)
    const prompt = 
      UPDATE_MEMORY_PROMPT + 
      `\n\n# 本轮对话的摘要\n\n${currentSummary}` +
      `\n\n# 本轮对话前你对自己的记忆\n\n${memoryAboutSelf || '无记忆'}` + 
      `\n\n# 本轮对话前你对用户的记忆\n\n${memoryAboutUser || '无记忆'}` + 
      `\n\n# 真实世界的相关信息\n\n${worldInfo}`
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
          { role: 'system', content: `**请按格式返回JSON字符串**, JSON Schema 为:\n\n${JSON.stringify(zodToJsonSchema(UpdateMemoryResponse), null, 2)}\n\n` + prompt + '**再次提醒: 你的回复应当是一个纯 JSON 字符串, 不包含任何其他内容' },
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
      ...prev.map(item => ({ ...item, belongTo: _uuid })),
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
