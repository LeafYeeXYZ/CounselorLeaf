import { create } from 'zustand'
import { set, get, speakApiList } from '../utils.ts'

type API = {
  speak: SpeakApi | null
  testSpeak: SpeakApiTest | null
  speakApiList: string[]
  currentSpeakApi: string
  setSpeakApi: (name: string) => Promise<void>
}

const localSpeakApi = await get('default_speak_api')
const defaultSpeakApi = speakApiList.find(({ name }) => name === localSpeakApi) ?? speakApiList[0]

export const useSpeakApi = create<API>()((setState) => ({
  speak: defaultSpeakApi.api,
  testSpeak: defaultSpeakApi.test,
  speakApiList: speakApiList.map(({ name }) => name),
  currentSpeakApi: defaultSpeakApi.name,
  setSpeakApi: async (name) => {
    const item = speakApiList.find(api => api.name === name)
    if (item) {
      setState({ speak: item.api, currentSpeakApi: name, testSpeak: item.test })
      await set('default_speak_api', name)
    }
    return
  },
}))
