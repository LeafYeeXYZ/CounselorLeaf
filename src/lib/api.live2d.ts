import { loadOml2d } from 'oh-my-live2d'
import type { LoadLive2d } from './types.ts'

export const cat: LoadLive2d = (element) => {
  const live2d = loadOml2d({
    parentElement: element,
    dockedPosition: 'right',
    mobileDisplay: true,
    menus: { disable: true },
    sayHello: false,
    tips: {
      style: {
        minWidth: '200px',
      }
    },
    models: [
      {
        path: 'https://model.oml2d.com/cat-white/model.json',
        position: [0, 20],
      }
    ],
  })
  return {
    stop: () => live2d.clearTips(),
    say: (text: string) => live2d.tipsMessage(text, 10000, Date.now()),
    remove: () => { 
      element.innerHTML = '' 
    },
  }
}
