import { loadOml2d } from 'oh-my-live2d'
import type { Oml2dEvents, Oml2dMethods, Oml2dProperties } from 'oh-my-live2d'

export type LoadLive2d = (
  element: HTMLElement,
) => Oml2dMethods & Oml2dEvents & Oml2dProperties

// 1. 对话框的样式自定义异常
// 2. 要是上面那个不好修也可以加个 onMessage 事件, 来手动渲染对话框
// 3. 要是实例原生有个 destroy 方法就好了
// 4. 模型没能定位到 parentElement 上
// 5. 说话时没能张嘴

export const catBoy: LoadLive2d = (element) => {
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
      path: '/live2d/cat-boy/白猫正太.model3.json',
      scale: 0.08,
      position: [0, 70],
    }],
  })
  return live2d
}

export const foxBoy: LoadLive2d = (element) => {
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
      path: '/live2d/fox-boy/hlxz.model3.json',
      scale: 0.08,
      position: [0, 70],
    }],
  })
  return live2d
}

export const rabbitBoy: LoadLive2d = (element) => {
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

export const evilBoy: LoadLive2d = (element) => {
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

export const goldBoy: LoadLive2d = (element) => {
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
      path: '/live2d/gold-boy/71全身无按键.model3.json',
      scale: 0.13,
      position: [0, 70],
    }],
  })
  return live2d
}

export const darkBoy: LoadLive2d = (element) => {
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
    models: [{
      path: '/live2d/dark-boy/紫汐.model3.json',
      scale: 0.09,
      position: [0, 70],
    }],
  })
  return live2d
}

export const jiniqi: LoadLive2d = (element) => {
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
      path: '/live2d/jiniqi/基尼奇.model3.json',
      scale: 0.08,
      position: [0, 70],
    }],
  })
  return live2d
}

export const heroBoy: LoadLive2d = (element) => {
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
    models: [{
      path: '/live2d/hero-boy/live1.model3.json',
      scale: 0.09,
      position: [0, 70],
    }],
  })
  return live2d
}

export const live2dList: { name: string, api: LoadLive2d }[] = [
  { name: '恶魔小叶子', api: evilBoy },
  { name: '兔兔小叶子', api: rabbitBoy },
  { name: '紫色小叶子', api: darkBoy },
  { name: '金毛小叶子', api: goldBoy },
  { name: '勇者小叶子', api: heroBoy },
  { name: '狐狸小叶子', api: foxBoy }, // 太大了, 不放进 Web 版
  { name: '猫猫小叶子', api: catBoy }, // 太大了, 不放进 Web 版
  { name: '基尼奇', api: jiniqi },
]
