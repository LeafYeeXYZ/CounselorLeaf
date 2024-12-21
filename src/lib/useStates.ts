import { create } from 'zustand'
import type { Oml2dEvents, Oml2dMethods, Oml2dProperties } from 'oh-my-live2d'
import type { MessageInstance } from 'antd/es/message/interface'
import type { ReactNode } from 'react'

type GlobalState = {
  disabled: false | string | ReactNode
  setDisabled: (disabled: false | string | ReactNode) => void

  live2d: Oml2dEvents & Oml2dMethods & Oml2dProperties | null
  setLive2d: (live2d: Oml2dEvents & Oml2dMethods & Oml2dProperties | null) => void
  
  messageApi: MessageInstance | null
  setMessageApi: (messageApi: MessageInstance | null) => void
}

export const useStates = create<GlobalState>()((set) => ({
  disabled: false,
  setDisabled: (disabled) => set({ disabled }),
  live2d: null,
  setLive2d: (live2d) => set({ live2d }),
  messageApi: null,
  setMessageApi: (messageApi) => set({ messageApi }),
}))
