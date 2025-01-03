import { create } from 'zustand'
import { set, get, speakApiList, live2dList, listenApiList, type Live2dApi, type LoadLive2d } from '../utils.ts'
import OpenAI from 'openai'
import { env } from '../env.ts'

type API = {

  chat: ChatApi
  testChat: ChatApiTest
  maxToken: number
  openaiEndpoint: string
  setOpenaiEndpoint: (url: string) => Promise<void>
  openaiApiKey: string
  setOpenaiApiKey: (key: string) => Promise<void>
  openaiModelName: string
  setOpenaiModelName: (name: string) => Promise<void>
  usedToken: number // -1 means unknown
  setUsedToken: (token: number | undefined) => Promise<void>
  
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

const localUsedToken = await get('last_used_token')
const localSpeakApi = await get('default_speak_api')
const localListenApi = await get('default_listen_api')
const localLive2d = await get('default_live2d')
const defaultUsedToken = localUsedToken ? Number(localUsedToken) : -1
const defaultSpeakApi = speakApiList.find(({ name }) => name === localSpeakApi) ?? speakApiList[0]
const defaultListenApi = listenApiList.find(({ name }) => name === localListenApi) ?? listenApiList[0]
const defaultLive2d = live2dList.find(({ name }) => name === localLive2d) ?? live2dList[0]
const defaultOpenaiEndpoint = await get('openai_endpoint') ?? 'http://localhost:11434/v1/'
const defaultOpenaiApiKey = await get('openai_api_key') ?? 'ollama'
const defaultOpenaiModelName = await get('openai_model_name') ?? 'qwen2.5:7b'
const defaultChatApi = new OpenAI({ baseURL: defaultOpenaiEndpoint, apiKey: defaultOpenaiApiKey, dangerouslyAllowBrowser: true })

export const useApi = create<API>()((setState, getState) => ({
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
  maxToken: env.VITE_MODEL_MAX_TOKENS,
  speak: defaultSpeakApi.api,
  testSpeak: defaultSpeakApi.test,
  listen: defaultListenApi.api,
  testListen: defaultListenApi.test,
  speakApiList: speakApiList.map(({ name }) => name),
  listenApiList: listenApiList.map(({ name }) => name),
  currentSpeakApi: defaultSpeakApi.name,
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
