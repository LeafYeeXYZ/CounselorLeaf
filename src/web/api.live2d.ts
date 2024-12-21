import { loadOml2d } from 'oh-my-live2d'
import type { Oml2dEvents, Oml2dMethods, Oml2dProperties } from 'oh-my-live2d'

export type LoadLive2d = (
  element: HTMLElement,
) => Oml2dMethods & Oml2dEvents & Oml2dProperties

// 一定要在 /scripts/before-web-build.ts 中
// 添加需要在构建时复制的模型名称
// 否则构建后的 Web 没有对应的模型文件

const rabbitBoy: LoadLive2d = (element) => {
  const live2d = loadOml2d({
    parentElement: element,
    dockedPosition: 'right',
    mobileDisplay: true,
    menus: { disable: true },
    sayHello: false,
    tips: {
      copyTips: { message: [] },
      style: { minWidth: '200px' },
    },
    stageStyle: { width: '280px' },
    models: [{
      path: '/live2d/rabbit-boy/兔兔【新.model3.json',
      scale: 0.18,
      position: [0, 70],
    }],
  })
  return live2d
}

const evilBoy: LoadLive2d = (element) => {
  const live2d = loadOml2d({
    parentElement: element,
    dockedPosition: 'right',
    mobileDisplay: true,
    menus: { disable: true },
    sayHello: false,
    tips: {
      copyTips: { message: [] },
    },
    models: [{
      path: '/live2d/evil-boy/no4.新（基础）.model3.json',
      scale: 0.11,
      position: [0, 70],
    }],
  })
  return live2d
}

export const live2dList: { name: string, api: LoadLive2d }[] = [
  { name: '恶魔小叶子', api: evilBoy },
  { name: '兔兔小叶子', api: rabbitBoy },
]
