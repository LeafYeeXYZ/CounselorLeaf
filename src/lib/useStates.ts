import type { Live2dApi } from './types.ts'
import { create } from 'zustand'

type Message = {
  role: string
  content: string
}

type State = {
  disabled: boolean
  setDisabled: (disabled: boolean) => void
  live2d: Live2dApi | null
  setLive2d: (live2d: Live2dApi | null) => void
  messages: Message[]
  setMessages: (messages: Message[]) => void
  updateMessages: (updater: (old: Message[]) => Message[]) => void
}

export const useStates = create<State>()((set) => ({
  disabled: false,
  setDisabled: (disabled) => set({ disabled }),
  live2d: null,
  setLive2d: (live2d) => set({ live2d }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  updateMessages: (updater) => set((state) => ({ messages: updater(state.messages) })),
}))
