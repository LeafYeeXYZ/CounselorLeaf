import { create } from 'zustand'
import type { MessageInstance } from 'antd/es/message/interface'
import type { ReactNode } from 'react'

type GlobalState = {
  disabled: false | string | ReactNode
  setDisabled: (disabled: false | string | ReactNode) => void
  messageApi: MessageInstance | null
  setMessageApi: (messageApi: MessageInstance | null) => void
}

export const useStates = create<GlobalState>()((set) => ({
  disabled: true,
  setDisabled: (disabled) => set({ disabled }),
  messageApi: null,
  setMessageApi: (messageApi) => set({ messageApi }),
}))
