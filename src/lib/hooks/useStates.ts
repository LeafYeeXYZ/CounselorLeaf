import { create } from 'zustand'
import type { MessageInstance } from 'antd/es/message/interface'
import type { ReactNode } from 'react'
import { get, set as _set } from '../utils.ts'

const DAFAULT_BACKGROUND = '/back.png'
const background = await get('background_image') || DAFAULT_BACKGROUND

type GlobalState = {
  disabled: false | string | ReactNode
  setDisabled: (disabled: false | string | ReactNode) => void
  messageApi: MessageInstance | null
  setMessageApi: (messageApi: MessageInstance | null) => void
  background: string
  setBackground: (background?: string) => void
}

export const useStates = create<GlobalState>()((set) => ({
  disabled: true,
  setDisabled: (disabled) => set({ disabled }),
  messageApi: null,
  setMessageApi: (messageApi) => set({ messageApi }),
  background,
  setBackground: (background) => {
    set({ background: background || DAFAULT_BACKGROUND })
    _set('background_image', background || DAFAULT_BACKGROUND)
  }
}))
