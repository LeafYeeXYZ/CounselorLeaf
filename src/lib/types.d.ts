declare type Env = {
  VITE_OLLAMA_LABEL_NAME: string
  VITE_OLLAMA_SERVER_URL: string
  VITE_OLLAMA_MODEL_NAME: string
  VITE_OLLAMA_MAX_TOKENS: number
  VITE_F5_TTS_SERVER_URL: string
  VITE_FISH_SPEECH_SERVER_URL: string
  VITE_DEBUG_COMPONENT: boolean
}

declare type ShortTermMemory = {
  role: string
  content: string
  timestamp: number
}

declare type LongTermMemory = {
  uuid: string
  startTime: number
  endTime: number
  title: string
  summary: string
}

declare type ArchivedMemory = {
  belongTo: string // uuid in long term memory
  role: string
  content: string
  timestamp: number
}

declare type StoreKeys = 
  'default_live2d' |
  'default_chat_api' |
  'default_speak_api' |
  'default_listen_api' |
  'self_name' |
  'user_name' |
  'last_used_token' |
  'short_term_memory' |
  'long_term_memory' |
  'archived_memory' |
  'memory_about_self' |
  'memory_about_user' |
  'current_summary'

declare type ChatApi = import('ollama/browser').Ollama
declare type ChatApiTest = () => Promise<boolean>
declare type ChatApiList = { name: string, api: ChatApi, test: ChatApiTest, maxToken: number }[]
declare type SpeakApi = (text: string) => Promise<void>
declare type SpeakApiTest = () => Promise<boolean>
declare type SpeakApiList = ({ name: string, api: SpeakApi, test: SpeakApiTest } | { name: string, api: null, test: null })[]
declare type ListenApi = (callback?: (text: string) => void) => { result: Promise<string>, start: () => void, stop: () => void }
declare type ListenApiTest = () => Promise<boolean>
declare type ListenApiList = ({ name: string, api: ListenApi, test: ListenApiTest } | { name: string, api: null, test: null })[]
