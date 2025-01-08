import { create } from 'zustand'
import { set, get, live2dList } from '../utils.ts'

type API = {
  live2d: Live2dApi | null
  loadLive2d: LoadLive2d
  live2dList: string[]
  currentLive2d: string
  setLoadLive2d: (name: string) => Promise<void>
  setLive2dApi: (api: Live2dApi | null) => Promise<void>

  background: string
  setBackground: (background?: string) => Promise<void>

  isFullScreen: boolean
  setIsFullScreen: (isFullScreen: boolean) => Promise<void>
}

const DAFAULT_BACKGROUND = '/back.png'

const background = await get('background_image') || DAFAULT_BACKGROUND
const localLive2d = await get('default_live2d')
const defaultLive2d = live2dList.find(({ name }) => name === localLive2d) ?? live2dList[0]
const localIsFullScreen = await get('is_full_screen') === 'true'

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
  background,
  setBackground: async (background) => {
    setState({ background: background || DAFAULT_BACKGROUND })
    await set('background_image', background || DAFAULT_BACKGROUND)
    return
  },
  isFullScreen: localIsFullScreen,
  setIsFullScreen: async (isFullScreen) => {
    await set('is_full_screen', isFullScreen.toString())
    setState({ isFullScreen })
    return
  },
}))
