import { loadOml2d } from 'oh-my-live2d'
import type { LoadLive2d } from './types.ts'

export const xyz: LoadLive2d = (element) => {
  const live2d = loadOml2d({
    parentElement: element,
    dockedPosition: 'right',
    mobileDisplay: true,
    menus: { disable: true },
    sayHello: false,
    tips: {
      copyTips: { message: [] },
      idleTips: { message: [] },
      // BUG: 加了这个属性就会导致对话框无法显示
      // style: {
      //   top: 'calc(100%-680px)',
      // },
    },
    models: [{
      path: '/live2d/cat-boy/白猫正太.model3.json',
      scale: 0.08,
      // 用来临时替代上面的属性的方案
      position: [0, 70],
    }],
  })
  return live2d
}
