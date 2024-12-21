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

export const bearBoy: LoadLive2d = (element) => {
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
      path: '/live2d/bear-boy/karien.model3.json',
      scale: 0.15,
      position: [0, 50],
    }],
  })
  return live2d
}

export const sickBoy: LoadLive2d = (element) => {
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
      path: '/live2d/sick-boy/71全身无按键.model3.json',
      scale: 0.13,
      position: [0, 70],
    }],
  })
  return live2d
}
