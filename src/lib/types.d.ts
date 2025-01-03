declare type Env = {
  VITE_MODEL_MAX_TOKENS: number
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
  'default_speak_api' |
  'default_listen_api' |
  'background_image' |
  'qweather_api_key' |
  'openai_api_key' |
  'openai_endpoint' |
  'openai_model_name' |
  'self_name' |
  'user_name' |
  'last_used_token' |
  'short_term_memory' |
  'long_term_memory' |
  'archived_memory' |
  'memory_about_self' |
  'memory_about_user' |
  'current_summary'

declare type ChatApi = import('openai').OpenAI
declare type ChatApiTest = () => Promise<boolean>
declare type SpeakApi = (text: string) => Promise<void>
declare type SpeakApiTest = () => Promise<boolean>
declare type SpeakApiList = ({ name: string, api: SpeakApi, test: SpeakApiTest } | { name: string, api: null, test: null })[]
declare type ListenApi = (callback?: (text: string) => void) => { result: Promise<string>, start: () => void, stop: () => void }
declare type ListenApiTest = () => Promise<boolean>
declare type ListenApiList = ({ name: string, api: ListenApi, test: ListenApiTest } | { name: string, api: null, test: null })[]
