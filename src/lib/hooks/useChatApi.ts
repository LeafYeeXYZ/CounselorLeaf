import { create } from 'zustand'
import { set, get } from '../utils.ts'
import OpenAI from 'openai'

type API = {
  chat: ChatApi
  testChat: ChatApiTest
  maxToken: number
  setMaxToken: (token: number) => Promise<void>
  openaiEndpoint: string
  setOpenaiEndpoint: (url: string) => Promise<void>
  openaiApiKey: string
  setOpenaiApiKey: (key: string) => Promise<void>
  openaiModelName: string
  setOpenaiModelName: (name: string) => Promise<void>
  usedToken: number // -1 means unknown
  setUsedToken: (token: number | undefined) => Promise<void>
}

const localUsedToken = await get('last_used_token')
const localMaxToken = await get('model_max_tokens')
const defaultUsedToken = localUsedToken ? Number(localUsedToken) : -1
const defaultMaxToken = localMaxToken ? Number(localMaxToken) : 8_000
const defaultOpenaiEndpoint = await get('openai_endpoint') ?? 'http://localhost:11434/v1/'
const defaultOpenaiApiKey = await get('openai_api_key') ?? 'ollama'
const defaultOpenaiModelName = await get('openai_model_name') ?? 'qwen2.5:7b'
const defaultChatApi = new OpenAI({ baseURL: defaultOpenaiEndpoint, apiKey: defaultOpenaiApiKey, dangerouslyAllowBrowser: true })

export const useChatApi = create<API>()((setState, getState) => ({
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
    setState({ openaiEndpoint: url, chat: new OpenAI({ baseURL: url, apiKey: openaiApiKey, dangerouslyAllowBrowser: true }) })
    await set('openai_endpoint', url)
    return
  },
  openaiApiKey: defaultOpenaiApiKey,
  setOpenaiApiKey: async (key) => {
    const { openaiEndpoint } = getState()
    setState({ openaiApiKey: key, chat: new OpenAI({ baseURL: openaiEndpoint, apiKey: key, dangerouslyAllowBrowser: true }) })
    await set('openai_api_key', key)
    return
  },
  openaiModelName: defaultOpenaiModelName,
  setOpenaiModelName: async (name) => {
    setState({ openaiModelName: name })
    await set('openai_model_name', name)
    return
  },
  testChat: async () => {
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
    return true
  },
  maxToken: defaultMaxToken,
  setMaxToken: async (token) => {
    setState({ maxToken: token })
    await set('model_max_tokens', token.toString())
    return
  }
}))
