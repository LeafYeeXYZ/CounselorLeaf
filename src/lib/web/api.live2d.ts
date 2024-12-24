import type { Oml2dEvents, Oml2dMethods, Oml2dProperties } from 'oh-my-live2d'

export type Live2dApi = Oml2dMethods & Oml2dEvents & Oml2dProperties
export type LoadLive2d = (
  element: HTMLElement,
) => Live2dApi
export type Live2dList = { 
  name: string
  api: LoadLive2d
}[]

import { evilBoy, rabbitBoy, darkBoy, goldBoy, jiniqi, heroBoy } from '../tauri/api.live2d.ts'

export const live2dList: Live2dList = [
  { name: '恶魔小叶子', api: evilBoy },
  { name: '兔兔小叶子', api: rabbitBoy },
  { name: '紫色小叶子', api: darkBoy },
  { name: '金毛小叶子', api: goldBoy },
  { name: '勇者小叶子', api: heroBoy },
  { name: '基尼奇', api: jiniqi },
]
