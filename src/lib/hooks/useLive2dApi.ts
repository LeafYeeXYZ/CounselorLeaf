import { create } from 'zustand'
import { set, get, live2dList } from '../utils.ts'

type API = {
  live2d: Live2dApi | null
  loadLive2d: LoadLive2d
  live2dList: string[]
  currentLive2d: string
  setLoadLive2d: (name: string) => Promise<void>
  setLive2dApi: (api: Live2dApi | null) => Promise<void>
}

const localLive2d = await get('default_live2d')
const defaultLive2d = live2dList.find(({ name }) => name === localLive2d) ?? live2dList[0]

export const useLive2dApi = create<API>()((setState) => ({
  live2d: null,
  loadLive2d: defaultLive2d.api,
  live2dList: live2dList.map(({ name }) => name),
  currentLive2d: defaultLive2d.name,
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
