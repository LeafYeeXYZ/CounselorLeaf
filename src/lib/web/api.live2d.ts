import type { Oml2dEvents, Oml2dMethods, Oml2dProperties } from 'oh-my-live2d'

export type LoadLive2d = (
  element: HTMLElement,
) => Oml2dMethods & Oml2dEvents & Oml2dProperties
export type Live2dList = { 
  name: string
  api: LoadLive2d
}[]

import { evilBoy, rabbitBoy, darkBoy, goldBoy, jiniqi, heroBoy } from '../tauri/api.live2d.ts'

// 一定要在 /scripts/before-web-build.ts 中
// 添加需要在构建时复制的模型名称
// 否则构建后的 Web 没有对应的模型文件
export const live2dList: Live2dList = [
  { name: '恶魔小叶子', api: evilBoy },
  { name: '兔兔小叶子', api: rabbitBoy },
  { name: '紫色小叶子', api: darkBoy },
  { name: '金毛小叶子', api: goldBoy },
  { name: '勇者小叶子', api: heroBoy },
  { name: '基尼奇', api: jiniqi },
]
