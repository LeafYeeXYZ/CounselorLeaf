import { create } from 'zustand'
import { set, get, speakApiList } from '../utils.ts'

type API = {
  speak: SpeakApi | null
  testSpeak: SpeakApiTest | null
  speakApiList: string[]
  currentSpeakApi: string
  setSpeakApi: (name: string) => Promise<void>

  fishSpeechEndpoint: string
  setFishSpeechEndpoint: (endpoint: string) => Promise<void>
  f5TtsEndpoint: string
  setF5TtsEndpoint: (endpoint: string) => Promise<void>
}

const localSpeakApi = await get('default_speak_api')
const localFishSpeechEndpoint = await get('fish_speech_endpoint') ?? 'http://127.0.0.1:8080'
const localF5TtsEndpoint = await get('f5_tts_endpoint') ?? 'http://127.0.0.1:5010/api'
const defaultLoad = speakApiList.find(({ name }) => name === localSpeakApi) ?? speakApiList[0]
const defaultApi = defaultLoad.api && defaultLoad.api({ fishSpeechEndpoint: localFishSpeechEndpoint, f5TtsEndpoint: localF5TtsEndpoint })

export const useSpeakApi = create<API>()((setState, getState) => ({
  speak: defaultApi && defaultApi.api,
  testSpeak: defaultApi && defaultApi.test,
  speakApiList: speakApiList.map(({ name }) => name),
  currentSpeakApi: defaultLoad.name,
  setSpeakApi: async (name) => {
    const item = speakApiList.find(api => api.name === name)
    if (item) {
      const { fishSpeechEndpoint, f5TtsEndpoint } = getState()
      const api = item.api && item.api({ fishSpeechEndpoint, f5TtsEndpoint })
      setState({ 
        currentSpeakApi: name, 
        speak: api && api.api,
        testSpeak: api && api.test,
      })
      await set('default_speak_api', name)
    }
    return
  },
  fishSpeechEndpoint: localFishSpeechEndpoint,
  setFishSpeechEndpoint: async (endpoint) => {
    const { f5TtsEndpoint, currentSpeakApi } = getState()
    const item = speakApiList.find(api => api.name === currentSpeakApi)!
    const api = item.api && item.api({ fishSpeechEndpoint: endpoint, f5TtsEndpoint })
    setState({ 
      fishSpeechEndpoint: endpoint,
      speak: api && api.api,
      testSpeak: api && api.test,
    })
    await set('fish_speech_endpoint', endpoint)
  },
  f5TtsEndpoint: localF5TtsEndpoint,
  setF5TtsEndpoint: async (endpoint) => {
    const { fishSpeechEndpoint, currentSpeakApi } = getState()
    const item = speakApiList.find(api => api.name === currentSpeakApi)!
    const api = item.api && item.api({ fishSpeechEndpoint, f5TtsEndpoint: endpoint })
    setState({ 
      f5TtsEndpoint: endpoint,
      speak: api && api.api,
      testSpeak: api && api.test,
    })
    await set('f5_tts_endpoint', endpoint)
  },
}))
