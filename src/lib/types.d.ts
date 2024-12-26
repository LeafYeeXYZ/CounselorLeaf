declare type Env = {
  VITE_OLLAMA_SERVER_URL: string
  VITE_OLLAMA_MODEL_NAME: string
  VITE_OLLAMA_MAX_TOKENS: number
  VITE_F5_TTS_SERVER_URL: string
}

declare type ShortTermMemory = {
  role: string
  content: string
  timestamp: number
}

declare type LongTermMemory = {
  uuid: string
  start: number
  end: number
  summary: string
}

declare type StoreKeys = 
  'default_live2d' |
  'default_chat_api' |
  'default_speak_api' |
  'default_listen_api' |
  'self_name' |
  'user_name' |
  'last_used_token' |
  'memory_about_self' | // 模型对用户的持久化记忆
  'memory_about_user' | // 模型对自己的持久化记忆
  'long_term_memory' | // 长期记忆, 包含数次对话的总结
  'short_term_memory' // 短期记忆, 包含当前对话的内容

declare type ChatApi = (messages: { role: string, content: string }[]) => AsyncGenerator<{ response: string, done: boolean, token?: number }, void, void>
declare type ChatApiTest = () => Promise<boolean>
declare type ChatApiList = { name: string, api: ChatApi, test: ChatApiTest, maxToken: number }[]
declare type SpeakApi = (text: string) => Promise<void>
declare type SpeakApiTest = () => Promise<boolean>
declare type SpeakApiList = ({ name: string, api: SpeakApi, test: SpeakApiTest } | { name: string, api: null, test: null })[]
declare type ListenApi = () => { result: Promise<string>, start: () => void, stop: () => void }
declare type ListenApiTest = () => Promise<boolean>
declare type ListenApiList = ({ name: string, api: ListenApi, test: ListenApiTest } | { name: string, api: null, test: null })[]
