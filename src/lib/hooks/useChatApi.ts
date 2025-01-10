import { create } from 'zustand'
import { set, get } from '../utils.ts'
import OpenAI from 'openai'

type API = {
  chat: ChatApi
  testChat: ChatApiTest
  maxToken: number
  setMaxToken: (token?: number) => Promise<void>
  openaiEndpoint: string
  setOpenaiEndpoint: (url?: string) => Promise<void>
  openaiApiKey: string
  setOpenaiApiKey: (key?: string) => Promise<void>
  openaiModelName: string
  setOpenaiModelName: (name?: string) => Promise<void>
  usedToken: number // -1 means unknown
  setUsedToken: (token: number | undefined) => Promise<void>

  vectorDimension: number
  setVectorDimension: (dimension?: number) => Promise<void>
  jinaEndpoint: string
  setJinaEndpoint: (url?: string) => Promise<void>
  jinaApiKey: string
  setJinaApiKey: (key?: string) => Promise<void>
  textToVector: (text: string) => Promise<number[]>
}

const DEFAULT_VECTOR_DIMENSION = 512
const DEFAULT_JINA_ENDPOINT = 'https://api.jina.ai/v1/embeddings'
const DEFAULT_MAX_TOKEN = 8_000
const DEFAULT_OPENAI_ENDPOINT = 'http://localhost:11434/v1/'
const DEFAULT_OPENAI_API_KEY = 'ollama'
const DEFAULT_OPENAI_MODEL_NAME = 'qwen2.5:7b'

const localUsedToken = await get('last_used_token')
const localMaxToken = await get('model_max_tokens')
const localVectorDimension = await get('vector_dimension')
const defaultVectorDimension = localVectorDimension ? Number(localVectorDimension) : DEFAULT_VECTOR_DIMENSION
const defaultJinaEndpoint = await get('jina_endpoint') ?? DEFAULT_JINA_ENDPOINT
const defaultJinaApiKey = await get('jina_api_key') ?? ''
const defaultUsedToken = localUsedToken ? Number(localUsedToken) : -1
const defaultMaxToken = localMaxToken ? Number(localMaxToken) : DEFAULT_MAX_TOKEN
const defaultOpenaiEndpoint = await get('openai_endpoint') ?? DEFAULT_OPENAI_ENDPOINT
const defaultOpenaiApiKey = await get('openai_api_key') ?? DEFAULT_OPENAI_API_KEY
const defaultOpenaiModelName = await get('openai_model_name') ?? DEFAULT_OPENAI_MODEL_NAME
const defaultChatApi = new OpenAI({ baseURL: defaultOpenaiEndpoint, apiKey: defaultOpenaiApiKey, dangerouslyAllowBrowser: true })

export const useChatApi = create<API>()((setState, getState) => ({
  textToVector: async (text) => {
    const { vectorDimension, jinaEndpoint, jinaApiKey } = getState()
    if (!jinaApiKey || !jinaEndpoint || !vectorDimension) {
      throw new Error('未设置 Jina API 相关信息')
    }
    const response = await fetch(jinaEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jinaApiKey}`,
      },
      body: JSON.stringify({
        model: 'jina-embeddings-v3',
        task: 'text-matching',
        late_chunking: false,
        dimensions: vectorDimension,
        embedding_type: 'float',
        input: [text],
      }),
    })
    const data = await response.json()
    return data.data[0].embedding
  },
  vectorDimension: defaultVectorDimension,
  setVectorDimension: async (dimension) => {
    setState({ vectorDimension: dimension ?? DEFAULT_VECTOR_DIMENSION })
    await set('vector_dimension', dimension?.toString())
    return
  },
  jinaEndpoint: defaultJinaEndpoint,
  setJinaEndpoint: async (url) => {
    setState({ jinaEndpoint: url || DEFAULT_JINA_ENDPOINT })
    await set('jina_endpoint', url)
    return
  },
  jinaApiKey: defaultJinaApiKey,
  setJinaApiKey: async (key) => {
    setState({ jinaApiKey: key ?? '' })
    await set('jina_api_key', key)
    return
  },
  chat: defaultChatApi,
  usedToken: defaultUsedToken,
  setUsedToken: async (token) => {
    setState({ usedToken: token })
    await set('last_used_token', token ?? -1)
    return
  },
  openaiEndpoint: defaultOpenaiEndpoint,
  setOpenaiEndpoint: async (url) => {
    const { openaiApiKey } = getState()
    const v = url || DEFAULT_OPENAI_ENDPOINT
    setState({ openaiEndpoint: v, chat: new OpenAI({ baseURL: v, apiKey: openaiApiKey, dangerouslyAllowBrowser: true }) })
    await set('openai_endpoint', v)
    sessionStorage.removeItem('openai_chat_test')
    return
  },
  openaiApiKey: defaultOpenaiApiKey,
  setOpenaiApiKey: async (key) => {
    const { openaiEndpoint } = getState()
    const v = key || DEFAULT_OPENAI_API_KEY
    setState({ openaiApiKey: v, chat: new OpenAI({ baseURL: openaiEndpoint, apiKey: v, dangerouslyAllowBrowser: true }) })
    await set('openai_api_key', v)
    sessionStorage.removeItem('openai_chat_test')
    return
  },
  openaiModelName: defaultOpenaiModelName,
  setOpenaiModelName: async (name) => {
    const v = name || DEFAULT_OPENAI_MODEL_NAME
    setState({ openaiModelName: v })
    await set('openai_model_name', v)
    sessionStorage.removeItem('openai_chat_test')
    return
  },
  testChat: async () => {
    if (sessionStorage.getItem('openai_chat_test') === 'ok') {
      return true
    }
    const { chat, openaiModelName } = getState()
    const { data } = await chat.models.list().catch((err) => {
      if (err.message === 'Connection error.') {
        throw new Error('推理模型未启动')
      } else {
        throw err
      }
    })
    if (data.every(({ id }) => id !== openaiModelName)) {
      throw new Error(`当前服务缺少模型 ${openaiModelName}`)
    }
    sessionStorage.setItem('openai_chat_test', 'ok')
    return true
  },
  maxToken: defaultMaxToken,
  setMaxToken: async (token) => {
    const v = token ?? DEFAULT_MAX_TOKEN
    setState({ maxToken: v })
    await set('model_max_tokens', v.toString())
    return
  }
}))
